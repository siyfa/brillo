/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments();
            table.string('uuid').notNullable().unique();
            table.string('email').notNullable().unique();
            table.string('username').notNullable().unique();
            table.string('phone_number').notNullable().unique();
            table.string('password').notNullable();
            table.jsonb('sports').notNullable();
            table.string('about').defaultTo(null);
            table.boolean('verified').defaultTo(false);
            table.boolean('status').defaultTo(false);
            table.string('token').defaultTo(null);
            table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('users')
};
