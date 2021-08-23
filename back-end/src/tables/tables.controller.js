const service = require('./tables.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties('table_name', 'capacity');
const { read: readReservation } = require('../reservations/reservations.service');
const controller = require('../reservations/reservations.controller');


const VALID_PROPERTIES = [
  'table_name',
  'capacity',
  'reservation_id'
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

async function tableExists(req, res, next) {
  const table = await service.read(req.params.tableId);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table ${req.params.tableId} cannot be found.` });
}

function validateTableName(req, res, next) {
  const { table_name } = req.body.data
  if (table_name.length >= 2) {
    return next();
  }
  next({ status: 400, message: `table_name should be two characters` });
}



function validateCapacity(req, res, next) {
  const people = controller.validatePeople
  const { capacity } = req.body.data
  //const { people } = res.locals.reservation;
  if (people < capacity) {
    return next()
  }
  next({ status: 400, message: `capacity should be a number` });
}


// function validateCapacity(req, res, next) {
//   const { capacity } = req.body.data
//   const { people } = res.locals.reservation;
//   if (people < capacity) {
//     return next()
//   }
//   next({ status: 400, message: `capacity should be a number` });
// }

async function list(req, res) {
  res.json({ data: await service.list() });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

function read(req, res) {
  res.json({ data: res.locals.table })
}

async function update(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };
  res.json({ data: await service.update(updatedTable) });
}

async function destroy(req, res) {
  await service.destroy(res.locals.table.table_id);
  res.sendStatus(204);
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasOnlyValidProperties, hasRequiredProperties, validateTableName, validateCapacity, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(tableExists), read],
  update: [asyncErrorBoundary(tableExists), hasOnlyValidProperties, hasRequiredProperties, asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)]
}
