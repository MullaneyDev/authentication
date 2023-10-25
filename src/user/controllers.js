const User = require("./model");
const { findMissingRequiredFields } = require("../utils/utils");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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
    const requiredFields = ["username", "email", "password", "isAdmin"];
    const missingFields = findMissingRequiredFields(requiredFields, req.body);

    if (missingFields.length >= 1) {
      res
        .status(409)
        .json({ message: `${missingFields} is missing from body` });
      return;
    }
    const newUser = await User.create(req.body);
    res.status(201).json({ message: "User Registered", newUser });
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
    if (!req.user) {
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
    const token = await jwt.sign(
      { id: req.user.id, isAdmin: req.user.isAdmin },
      process.env.SECRET_KEY
    );

    if (!req.unHashedPassword) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    res.status(201).json({
      message: "Successful login",
      user: {
        username: req.user.username,
        token: token,
        isAdmin: req.user.isAdmin,
      },
    });
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
    // if (!req.authCheck.isAdmin) {
    //   res.status(401).json({ message: "No Admin rights" });
    //   return;
    // }
    const getUsers = await User.findAll();
    if (getUsers.length < 1) {
      res.status(503).json({ message: "No records exist" });
      return;
    }
    res.status(200).json({ message: "success", getUsers });
  } catch (error) {
    res.status(503).json({ message: error.message, error });
  }
};

//PUT
const updateUsername = async (req, res) => {
  try {
    const requiredFields = ["username", "newUsername"];
    const missingFields = findMissingRequiredFields(requiredFields, req.body);

    if (missingFields.length >= 1) {
      res
        .status(409)
        .json({ message: `${missingFields} is missing from body` });
      return;
    }

    const updateUsername = await User.update(
        {username: req.body.newUsername},{where: {username: req.body.username}}
    )
    res.status(201).json({message: "Username updated", updateUsername})
  } catch (error) {
    res.status(503).json({ message: error.message, error });
  }
};

//DELETE
const deleteUser = async (req,res) => {
    try {
        const deleteUser = await User.destroy({where: {id: req.user.id}})
        res.status(201).json({message: "User deleted", deleteUser})
    } catch (error) {
        res.status(503).json({ message: error.message, error });
    }
}

module.exports = {
  register,
  login,
  findAllUsers,
  updateUsername,
  deleteUser
};
