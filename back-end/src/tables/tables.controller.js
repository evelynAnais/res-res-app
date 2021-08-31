const service = require('./tables.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const hasProperties = require('../errors/hasProperties');
const hasRequiredProperties = hasProperties('table_name', 'capacity');
const hasRequiredUpdateProperties = hasProperties('reservation_id');
const { read: readReservation } = require('../reservations/reservations.service');

const VALID_PROPERTIES = [
  'table_name',
  'capacity',
  'reservation_id',
  'people'
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(', ')}`,
    });
  }
  next();
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.tableId);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table ${req.params.tableId} cannot be found.` });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await readReservation(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${reservation_id} cannot be found.` });
}

function validateTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length >= 2) {
    return next();
  }
  next({ status: 400, message: `table_name should be two characters` });
}

function validateSufficientCapacity(req, res, next) {
  const { capacity } = res.locals.table;
  const { people } = res.locals.reservation;
  if (people <= capacity) {
    return next();
  }
  next({ status: 400, message: `capacity less than people` });
}

function validateCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (typeof capacity === 'number') {
    return next();
  }
  next({ status: 400, message: `capacity should be a number` });
}

// possible bug in test, it sends people instead of capacity. passes test right now. after thinkful. change test and valid properties.

function validateSeated(req, res, next) {
  const { status } = res.locals.reservation;
  if (status !== 'seated') {
    return next();
    }
    next({ status: 400, message: 'Reservation is already seated.' });
}

function validateAvailable(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    return next();
  }
  next({ status: 400, message: 'Table is occupied.' });
}

function validateNotAvailable(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    return next();
  }
  next({ status: 400, message: 'not occupied.' });
}

async function list(req, res) {
  res.json({ data: await service.list() });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

function read(req, res) {
  res.json({ data: res.locals.table });
}

async function update(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
    reservation_id: res.locals.reservation.reservation_id
  };
  res.json({ data: await service.update(updatedTable) });
}

async function destroy(req, res) {
  const data = await service.destroy(res.locals.table.table_id, res.locals.table.reservation_id);
  res.status(200).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasOnlyValidProperties, 
    hasRequiredProperties, 
    validateTableName, 
    validateCapacity,
    asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(tableExists), read],
  update: [
    hasOnlyValidProperties, 
    hasRequiredUpdateProperties, 
    asyncErrorBoundary(tableExists), 
    asyncErrorBoundary(reservationExists),
    validateSeated,
    validateSufficientCapacity,
    validateAvailable,
    asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(tableExists), validateNotAvailable, asyncErrorBoundary(destroy)]
}
