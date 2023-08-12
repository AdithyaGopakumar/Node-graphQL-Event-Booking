const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeaders = req.get("Authorization");
  if (!authHeaders) {
    req.isAuthorized = false;
    return next();
  }

  const token = authHeaders.split(" ")[1];
  if (!token || token === "") {
    req.isAuthorized = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.HASH_STRING);
  } catch (error) {
    req.isAuthorized = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuthorized = false;
    return next();
  }

  req.isAuthorized = true
  req.user_id = decodedToken.user_id
  next()
};
