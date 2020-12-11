import { Router } from "express";
import ProductsClient from "../drivers/products-client";
import refreshCookie from "./refresh-cookie";
import { mergeProductsWithWishlists } from "./utils";

const productsClient = ProductsClient();

const ProductsRouter = () => {
  const productsRouter = Router();

  const addWishLists = async (products) => {
    const productIds = products.map((product) => product.id);

    const wishlists = await productsClient.getWishlists(productIds);

    // if (!wishlists.length) {
    //   return products;
    // }

    return mergeProductsWithWishlists(products, wishlists);
  };

  productsRouter.get("/products/latest", refreshCookie, async (req, res) => {
    const {
      query: { page, page_size: pageSize },
    } = req;

    const products = await productsClient.getLatest({ page, pageSize });

    const productsWithWishlists = await addWishLists(products);

    return res.json(productsWithWishlists);
  });

  productsRouter.get("/products/top", refreshCookie, async (req, res) => {
    const {
      query: { page, page_size: pageSize },
    } = req;

    const products = await productsClient.getTop({ page, pageSize });

    const productsWithWishlists = await addWishLists(products);

    return res.json(productsWithWishlists);
  });

  return productsRouter;
};

export default ProductsRouter;
