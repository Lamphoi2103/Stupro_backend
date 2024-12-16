const jwt = require("jsonwebtoken");

const middlewareAthentic = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token đã hết hạn");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("bạn chưa xác thực");
    }
  },
  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareAthentic.verifyToken(req, res, () => {
      if (req.user.role == 2 || req.user.id == req.params.id) {
        next();
      } else {
        res.status(403).json("bạn không đủ quyền");
      }
    });
  },
};
module.exports = middlewareAthentic;
