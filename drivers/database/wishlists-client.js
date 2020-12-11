import client from "./database-client";

const WishlistsClient = () => {
  const wishlistsClient = {};

  const wishlistSelect = ["id", "name", "user_id"];

  wishlistsClient.byId = async (id) => {
    const [wishlist] = await client("Wishlist")
      .where({
        id,
      })
      .select(wishlistSelect);

    return wishlist;
  };

  wishlistsClient.insert = async ({ name, userId }) => {
    const [wishlist] = await client("Wishlist")
      .insert({ name, user_id: userId })
      .returning(wishlistSelect);

    return wishlist;
  };

  wishlistsClient.getProducts = async (id) => {
    const productRecords = await client("Wishlist_Product")
      .where({
        wishlist_id: id,
      })
      .select("product_id");

    return productRecords.map((r) => r.product_id);
  };

  wishlistsClient.byUserId = async (userId) => {
    const wishlists = await client("Wishlist")
      .where({
        user_id: userId,
      })
      .select(wishlistSelect);

    return wishlists;
  };

  wishlistsClient.addProduct = async ({ id, productId }) => {
    await client("Wishlist_Product").insert({
      wishlist_id: id,
      product_id: productId,
    });

    return wishlistsClient.getProducts(id);
  };

  wishlistsClient.removeProduct = async ({ id, productId }) => {
    await client("Wishlist_Product")
      .where({
        wishlist_id: id,
        product_id: productId,
      })
      .del();

    return wishlistsClient.getProducts(id);
  };

  wishlistsClient.delete = (id) => {
    return client("Wishlist")
      .where({
        id,
      })
      .del();
  };

  return wishlistsClient;
};

export default WishlistsClient;
