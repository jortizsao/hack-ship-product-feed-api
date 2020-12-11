import fetch from "node-fetch";

import client from "./database/database-client";

const ProductsClient = () => {
  const productsClient = {};

  const baseUrl = process.env.WDN_API_HOST;

  productsClient.getLatest = async ({ page = 1, pageSize = 12 }) => {
    return fetch(
      `${baseUrl}/products/latest?page=${page}&page_size=${pageSize}`
    )
      .then((res) => res.json())
      .then(({ data }) => data);
  };

  productsClient.getTop = async ({ page = 1, pageSize = 12 }) => {
    return fetch(`${baseUrl}/products/top?page=${page}&page_size=${pageSize}`)
      .then((res) => res.json())
      .then(({ data }) => data);
  };

  productsClient.byId = async (id) => {
    return fetch(`${baseUrl}/products/${id}?likers[limit]=1`)
      .then((res) => res.json())
      .then(({ data }) => data);
  };

  productsClient.getWishlists = async (productIds) => {
    if (!productIds) {
      return [];
    }

    const wishlistProductRecords = await client("Wishlist_Product")
      .whereIn("product_id", productIds)
      .select("*");

    console.log("wishlistProductRecords", wishlistProductRecords);

    return wishlistProductRecords;
  };

  return productsClient;
};

export default ProductsClient;
