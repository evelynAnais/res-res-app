exports.up = function (knex) {
  return knex.schema.createTable('reservations', (table) => {
    table.increments('reservation_id').primary();
    table.string('')
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('reservations');
};


// First name: <input name='first_name' />
// Last name: <input name='last_name' />
// Mobile number: <input name='mobile_number' />
// Date of reservation: <input name='reservation_date' />
// Time of reservation: <input name='reservation_time' />
// Number of people in the party, which must be at least 1 person. <input name='people' />