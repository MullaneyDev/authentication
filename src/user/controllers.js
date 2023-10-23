const User = require("./model");
const { findMissingRequiredFields } = require("../utils/utils");

// POST
const register = async (req, res) => {
  try {
    const findUser = await User.findAll({
      where: { username: req.body.username },
    });
    if (findUser.length >= 1) {
      res.status(409).json({ message: "Username already exists" });
      return;
    }
    if (req.body === null) {
      res.status(409).json({ message: "Body is missing" });
      return;
    }
    const requiredFields = ["username", "email", "password"];
    const missingFields = findMissingRequiredFields(requiredFields, req.body);

    if (missingFields.length >= 1) {
      res
        .status(409)
        .json({ message: `${missingFields} is missing from body` });
      return;
    }
    const newUser = await User.create(req.body);
    res.status(201).json({ message: "success", newUser });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(412).json({ message: error.message, error });
      return;
    }
    res.status(500).json({ message: error.message, error });
  }
};

// POST
const login = async (req, res) => {
  try {
    if (req.body === null) {
      res.status(409).json({ message: "Body is missing" });
      return;
    }
    const requiredFields = ["username", "password"];
    const missingFields = findMissingRequiredFields(requiredFields, req.body);

    if (missingFields.length >= 1) {
      res.status(409).json({
        message: `${missingFields} is missing from request`,
      });
      return;
    }
    if (req.body.unHashedPassword) {
      res.status(201).json({ message: "Successful login" });
      return;
    }
    if (!req.body.unHashedPassword) {
      res.status(401).json({ message: "Invalid Password" });
      return;
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(412).json({ message: error.message, error });
      return;
    }
    res.status(500).json({ message: error.message, error });
  }
};

// GET
const findAllUsers = async (req, res) => {
  try {
    const getUsers = await User.findAll();
    if (getUsers.length >= 1) {
      res.status(200).json({ message: "success", getUsers });
      return;
    }
    res.status(503).json({ message: "No records exist" });
  } catch (error) {
    res.status(503).json({ message: error.message, error });
  }
};

module.exports = {
  register,
  login,
  findAllUsers,
};
