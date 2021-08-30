const knex = require('../db/connection');

function list() {
  return knex('reservations')
    .select('reservations.*')
    .orderBy('reservation_date')
    .orderBy('reservation_time');
}

function listByDate(date) {
  return knex('reservations')
    .select('reservations.*')
    .where({ reservation_date: date })
    .whereNot({ status: 'finished' })
    .orderBy('reservation_time');
}

function create(reservation) {
  return knex('reservations')
    .insert(reservation)
    .returning('*')
    .then((createdReservation) => createdReservation[0]);
}

function read(reservation_id) {
  return knex('reservations').select('*').where({ reservation_id }).first();
}

function update(updatedReservation) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, '*')
    .then((updatedReservations) => updatedReservations[0]);
}

function updateStatus(updatedReservation) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id: updatedReservation.reservation_id })
    .update({ status: updatedReservation.status })
    .returning('*')
    .then((updatedReservations) => updatedReservations[0]);
}

function destroy(reservation_id) {
  return knex('reservations').where({ reservation_id }).del();
}

module.exports = {
  list,
  listByDate,
  create,
  read,
  update,
  updateStatus,
  destroy
}