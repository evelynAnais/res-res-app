const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties('first_name', 'last_name', 'mobile_number', 'reservation_date', 'reservation_time', 'people');

const VALID_PROPERTIES = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
  'status',
  'reservation_id',
  'created_at',
  'updated_at'
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${req.params.reservationId} cannot be found.` });
}

function validateDate(req, res, next) {
  const { reservation_date } = req.body.data
  const date = new Date(reservation_date)
  if (date.getTime() === date.getTime()) {
    return next();
  }
  next({ status: 400, message: `need valid reservation_date` });
}

function validateTime(req, res, next) {
  const { reservation_time } = req.body.data
  const time = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(reservation_time);
  if (time) {
    return next();
  }
  next({ status: 400, message: `need valid reservation_time` });
}

function validatePeople(req, res, next) {
  const { people } = req.body.data
  if (typeof people === 'number') {
    return next ()
  }
  next({ status: 400, message: `people should be a number` });
}

async function list(req, res) {
  const { date, mobile_number } = req.query;

  if (date) {
    res.json({ data: await service.listByDate(date) });
  } else if (mobile_number) {
    res.json({ data: await service.search(mobile_number) });
  } else {
    res.json({ data: await service.list() });
  }
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

function read(req, res) {
  res.json({ data: res.locals.reservation })
}

async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  res.json({ data: await service.update(updatedReservation) });
}

async function destroy(req, res) {
  await service.destroy(res.locals.reservation.reservation_id);
  res.sendStatus(204);
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasOnlyValidProperties, hasRequiredProperties, validatePeople, validateDate, validateTime, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), hasOnlyValidProperties, hasRequiredProperties, asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)]
}