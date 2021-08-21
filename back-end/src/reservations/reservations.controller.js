/**
 * List handler for reservation resources
 */
// async function list(req, res) {
//   res.json({
//     data: [],
//   });
// }

// module.exports = {
//   list,
// };


const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties('reservation', '','');

const VALID_PROPERTIES = [
  'reservation',
  '',
  '',
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
  next({ status: 404, message: `Reservation cannot be found.` });
}

async function list(req, res) {
  res.json({ data: await service.list() });
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
  create: [hasOnlyValidProperties, hasRequiredProperties, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), hasOnlyValidProperties, hasRequiredProperties, asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)]
}
