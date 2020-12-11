/* eslint-disable import/prefer-default-export */
const keyBy = (key, array) => {
  const map = {};

  for (const item of array) {
    if (map[item[key]]) {
      map[item[key]] = [...map[item[key]], item];
    } else {
      map[item[key]] = [item];
    }
  }

  return map;
};

export const mergeProductsWithWishlists = (products, wishlists) => {
  const wishlistsByProductId = keyBy("product_id", wishlists);

  return products.map((product) => {
    const wishlistProduct = wishlistsByProductId[product.id];

    if (!wishlistProduct) {
      return {
        ...product,
        wishlists: null,
      };
    }

    return {
      ...product,
      wishlists: wishlistProduct.map((item) => item.wishlist_id),
    };
  });
};
