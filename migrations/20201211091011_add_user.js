exports.up = (knex) =>
  knex.schema.createTable("User", (t) => {
    t.string("id").primary();
    t.string("email", 255).unique().notNullable();
  });

exports.down = (knex) => knex.schema.dropTable("User");
