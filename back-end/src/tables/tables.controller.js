const service = require('./tables.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties('table', '','');

const VALID_PROPERTIES = [
  'table',
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

async function tableExists(req, res, next) {
  const table = await service.read(req.params.tableId);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table cannot be found.` });
}

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
  create: [hasOnlyValidProperties, hasRequiredProperties, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(tableExists), read],
  update: [asyncErrorBoundary(tableExists), hasOnlyValidProperties, hasRequiredProperties, asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)]
}
