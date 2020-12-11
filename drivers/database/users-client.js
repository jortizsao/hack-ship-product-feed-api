import client from "./database-client";

const UsersClient = () => {
  const usersClient = {};

  usersClient.insert = async ({ id, email }) => {
    const [user] = await client("User").insert({ id, email }).returning("*");

    return user;
  };

  usersClient.byId = async (id) => {
    const [user] = await client("User")
      .where({
        id,
      })
      .select("*");

    return user;
  };

  usersClient.byEmail = async (email) => {
    const [user] = await client("User")
      .where({
        email,
      })
      .select("*");

    return user;
  };

  return usersClient;
};

export default UsersClient;
