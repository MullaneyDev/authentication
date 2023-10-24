const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const jwt = require("jsonwebtoken");

const User = require("../user/model");

const hashPass = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    next();
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error });
  }
};

const comparePassword = async (req, res, next) => {
  try {
    req.user = await User.findOne({ where: { username: req.body.username } });
    if (!req.user) {
      res.status(401).json({ message: "Invalid Username" });
      return;
    }

    req.unHashedPassword = await bcrypt.compare(
      req.body.password,
      req.user.password
    );
    next();
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error });
  }
};

const tokenCheck = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization,
      process.env.SECRET_KEY
    );
    req.authCheck = await User.findOne({ where: { id: decodedToken.id } });
    if (!req.authCheck) {
      res.status(401).json({ message: "Invalid Token" });
      return;
    }
    next();
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error });
  }
};
module.exports = {
  hashPass,
  comparePassword,
  tokenCheck,
};
