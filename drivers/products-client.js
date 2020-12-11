import fetch from "node-fetch";
import pLimit from "p-limit";

import client from "./database/database-client";

const ProductsClient = () => {
  const productsClient = {};
  const limit = pLimit(10);

  const baseUrl = process.env.WDN_API_HOST;

  productsClient.getLatest = async ({ page = 1, pageSize = 12 }) => {
    try {
      const products = await fetch(
        `${baseUrl}/products/latest?page=${page}&page_size=${pageSize}`
      )
        .then((res) => res.json())
        .then(({ data }) => data);

      const productWithPrices = await Promise.all(
        products.map((product) =>
          limit(async () => {
            const price = await productsClient.getPrice(product.id);

            return {
              ...product,
              price,
            };
          })
        )
      );

      return productWithPrices;
    } catch (error) {
      console.log("error fetching product", error);
      return [];
    }
  };

  productsClient.getTop = async ({ page = 1, pageSize = 12 }) => {
    try {
      const products = await fetch(
        `${baseUrl}/products/top?page=${page}&page_size=${pageSize}`
      )
        .then((res) => res.json())
        .then(({ data }) => data);

      const productWithPrices = await Promise.all(
        products.map((product) =>
          limit(async () => {
            const price = await productsClient.getPrice(product.id);

            return {
              ...product,
              price,
            };
          })
        )
      );

      return productWithPrices;
    } catch (error) {
      console.log("error fetching product", error);
      return [];
    }
  };

  productsClient.byId = async (id) => {
    try {
      const product = await fetch(`${baseUrl}/products/${id}?likers[limit]=1`)
        .then((res) => res.json())
        .then(({ data }) => data);

      const bestPrice = await productsClient.getPrice(product.id);

      return {
        ...product,
        price: bestPrice,
      };
    } catch (error) {
      console.log("error fetching product", error);
      return null;
    }
  };

  productsClient.getWishlists = async (productIds) => {
    if (!productIds) {
      return [];
    }

    const wishlistProductRecords = await client("Wishlist_Product")
      .whereIn("product_id", productIds)
      .select("*");

    return wishlistProductRecords;
  };

  productsClient.getPrice = async (id) => {
    return fetch(`${baseUrl}/products/${id}/best_offer`)
      .then((res) => res.json())
      .then(({ data }) => data)
      .then((data) => data.attributes.price_usd);
  };

  return productsClient;
};

export default ProductsClient;
