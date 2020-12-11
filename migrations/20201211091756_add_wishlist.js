exports.up = (knex) => {
  return knex.schema.createTable("Wishlist", (t) => {
    t.increments();
    t.string("name", 255).notNullable();
    t.string("user_id").notNullable();
    t.foreign("user_id").references("User.id");
  });
};

exports.down = (knex) => knex.schema.dropTable("Wishlist");
