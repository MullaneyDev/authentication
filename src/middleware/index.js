const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

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
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      res.status(401).json({ message: "Invalid Username" });
      return;
    }
    unHashedPassword = await bcrypt.compare(req.body.password, user.password);

    next();
  } catch (error) {
    res.status(501).json({ errorMessage: error.message, error });
  }
};

module.exports = {
  hashPass,
  comparePassword,
};
