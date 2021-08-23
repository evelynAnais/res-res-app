const knex = require('../db/connection');

function list() {
  return knex('tables').select('*').orderBy("table_name", "asc");
}

function create(table) {
  return knex('tables')
    .insert(table)
    .returning('*')
    .then((createdTable) => createdTable[0]);
}

function read(table_id) {
  return knex('tables').select('*').where({ table_id }).first();
}

function update(updatedTable) {
  return knex('tables')
    .select('*')
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, '*')
    .then((updatedTables) => updatedTables[0]);
}

function destroy(table_id) {
  return knex('tables').where({ table_id }).del();
}

module.exports = {
  list,
  create,
  read,
  update,
  destroy
}