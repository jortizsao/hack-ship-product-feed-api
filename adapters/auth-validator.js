export default (req, res, next) => {
  // if (!req.cookies.user) {
  //   return res.status(403).send('You need to be signed in"');
  // }

  return next();
};
