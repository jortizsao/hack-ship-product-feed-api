import { Router } from "express";
import pLimit from "p-limit";
import WishlistClient from "../drivers/database/wishlists-client";
import ProductsClient from "../drivers/products-client";
import authValidator from "./auth-validator";
import refreshCookie from "./refresh-cookie";
import { mergeProductsWithWishlists } from "./utils";

const wishlistClient = WishlistClient();
const productsClient = ProductsClient();

const WishlistRouter = () => {
  const wishlistRouter = Router();
  const limit = pLimit(10);

  const wishlistValidator = async (req, res, next) => {
    const userId = "93b9959a-5347-4cde-93c1-1be603c94ca4";

    const wishlist = await wishlistClient.byId(req.params.id);

    if (!wishlist) {
      return res.status(400).json({ error: "The wishlist doesn't exist" });
    }

    if (wishlist.user_id !== userId) {
      return res
        .status(400)
        .json({ error: "The wishlist doesn't belong to your user" });
    }

    return next();
  };

  wishlistRouter.get(
    "/my-wishlists",
    authValidator,
    refreshCookie,
    async (req, res) => {
      const userId = "93b9959a-5347-4cde-93c1-1be603c94ca4";

      const wishlists = await wishlistClient.byUserId(userId);

      return res.json(wishlists);
    }
  );

  wishlistRouter.post(
    "/wishlists",
    authValidator,
    refreshCookie,
    async (req, res) => {
      const { body } = req;
      const userId = "93b9959a-5347-4cde-93c1-1be603c94ca4";

      if (!body.name) {
        return res
          .status(400)
          .json({ error: "Please provide a name for the wishlist" });
      }

      const wishlist = await wishlistClient.insert({
        name: body.name,
        userId,
      });

      if (body.productId) {
        const products = await wishlistClient.addProduct({
          id: wishlist.id,
          productId: body.productId,
        });

        return res.json({ ...wishlist, products });
      }

      return res.json({ ...wishlist, products: null });
    }
  );

  wishlistRouter.get(
    "/wishlists/:id/products",
    authValidator,
    refreshCookie,
    wishlistValidator,
    async (req, res) => {
      const productIds = await wishlistClient.getProducts(req.params.id);

      const wishlists = await productsClient.getWishlists(productIds);

      let products = (
        await Promise.all(
          productIds.map((id) =>
            limit(() =>
              productsClient.byId(id).catch((err) => console.log(err))
            )
          )
        )
      ).filter(Boolean);

      if (wishlists.length) {
        products = mergeProductsWithWishlists(products, wishlists);
      }

      return res.json(products);
    }
  );

  wishlistRouter.post(
    "/wishlists/:id/products",
    authValidator,
    refreshCookie,
    wishlistValidator,
    async (req, res) => {
      const { body } = req;

      if (!body.productId) {
        return res
          .status(400)
          .json({ error: "Please provide a product id for the wishlist" });
      }

      const products = await wishlistClient.addProduct({
        id: req.params.id,
        productId: body.productId,
      });

      return res.json(products);
    }
  );

  wishlistRouter.delete(
    "/wishlists/:id/products/:product_id",
    authValidator,
    refreshCookie,
    wishlistValidator,
    async (req, res) => {
      const products = await wishlistClient.removeProduct({
        id: req.params.id,
        productId: req.params.product_id,
      });

      return res.json(products);
    }
  );

  wishlistRouter.delete(
    "/wishlists/:id",
    authValidator,
    refreshCookie,
    wishlistValidator,
    async (req, res) => {
      const wishlist = await wishlistClient.delete(req.params.id);

      return res.json(wishlist);
    }
  );

  return wishlistRouter;
};

export default WishlistRouter;
