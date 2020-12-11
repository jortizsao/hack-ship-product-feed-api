import { Router } from "express";
import CategoriesClient from "../drivers/categories-client";
import refreshCookie from "./refresh-cookie";

const categoriesClient = CategoriesClient();

const CategoriesRouter = () => {
  const categoriesRouter = Router();

  categoriesRouter.get("/categories", refreshCookie, async (req, res) => {
    const categories = await categoriesClient.find();

    return res.json(categories);
  });

  categoriesRouter.get(
    "/categories/:id/products",
    refreshCookie,
    async (req, res) => {
      const {
        query: { page, page_size: pageSize },
        params: { id },
      } = req;

      const products = await categoriesClient.getProducts({
        id,
        page,
        pageSize,
      });

      return res.json(products);
    }
  );

  return categoriesRouter;
};

export default CategoriesRouter;
