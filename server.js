import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import WishlistRouter from "./adapters/wishlist-router";
import UsersRouter from "./adapters/users-router";
import ProductsRouter from "./adapters/products-router";
import CategoriesRouter from "./adapters/categories-router";

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(UsersRouter());
app.use(WishlistRouter());
app.use(ProductsRouter());
app.use(CategoriesRouter());

const port = process.env.PORT || 3000;

// eslint-disable-next-line
app.use((err, req, res, next) => {
  res.status(500).send(err);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
