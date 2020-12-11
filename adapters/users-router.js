import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import UsersClient from "../drivers/database/users-client";
import authValidator from "./auth-validator";
import refreshCookie from "./refresh-cookie";

const usersClient = UsersClient();

const UsersRouter = () => {
  const usersRouter = Router();

  usersRouter.post("/signup", async (req, res) => {
    const { body } = req;

    if (!body.email) {
      return res.status(400).json({ error: "Please provide an email" });
    }

    const existingUser = await usersClient.byEmail(body.email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await usersClient.insert({
      id: uuidv4(),
      email: body.email,
    });

    res.cookie("user", user.id, {
      maxAge: 9000000,
      sameSite: "None",
      secure: true,
    });

    return res.json(user);
  });

  usersRouter.post("/signin", async (req, res) => {
    const { body } = req;

    if (!body.email) {
      return res.status(400).json({ error: "Please provide an email" });
    }

    const user = await usersClient.byEmail(body.email);

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    res.cookie("user", user.id, {
      maxAge: 9000000,
      sameSite: "None",
      secure: true,
    });

    return res.json(user);
  });

  usersRouter.get("/me", authValidator, refreshCookie, async (req, res) => {
    const userId = "93b9959a-5347-4cde-93c1-1be603c94ca4";

    const user = await usersClient.byId(userId);

    return res.json(user);
  });

  usersRouter.post("/signout", async (req, res) => {
    res.clearCookie("user", {
      maxAge: 9000000,
      sameSite: "None",
      secure: true,
    });

    return res.send("logged out");
  });

  return usersRouter;
};

export default UsersRouter;
