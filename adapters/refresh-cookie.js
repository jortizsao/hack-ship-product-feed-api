export default (req, res, next) => {
  res.cookie("user", "93b9959a-5347-4cde-93c1-1be603c94ca4", {
    maxAge: 9000000,
    sameSite: "None",
    secure: true,
  });

  return next();
};
