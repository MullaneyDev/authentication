const { Router } = require("express");
const userRouter = Router();

const { hashPass, comparePassword } = require("../middleware/index");
const { register, login, findAllUsers } = require("./controllers");

userRouter.post("/register", hashPass, register);

userRouter.post("/login", comparePassword, login);

userRouter.get("/", findAllUsers);

module.exports = userRouter;
