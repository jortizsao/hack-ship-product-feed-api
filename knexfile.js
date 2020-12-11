module.exports = {
  client: "postgresql",
  connection: {
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
