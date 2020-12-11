export default (req, res, next) => {
  res.cookie("user", req.cookies.user, { maxAge: 9000000 });

  return next();
};
