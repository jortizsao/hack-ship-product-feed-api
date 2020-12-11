exports.up = (knex) => {
  return knex.schema.createTable("Wishlist_Product", (t) => {
    t.integer("wishlist_id").unsigned();
    t.string("product_id");
    t.primary(["wishlist_id", "product_id"]);
    t.foreign("wishlist_id").references("Wishlist.id");
  });
};

exports.down = (knex) => knex.schema.dropTable("Wishlist_Product");
