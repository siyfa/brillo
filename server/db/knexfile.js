// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { knexSnakeCaseMappers } = require("objection");
const config = require("config");

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: config.get("development.database"),
      user:     config.get("development.user"),
      password: config.get("development.password"),
      port: config.get("development.port"),
      host: config.get("development.host")
    },
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: './seeds'
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    // automatically convert camelCase to snake case
    // so table names are in snake case
    // but we can use camelCase fields per default
    ...knexSnakeCaseMappers(),
  },


};
