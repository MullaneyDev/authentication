const { Router } = require("express");
const userRouter = Router();

const {
  hashPass,
  comparePassword,
  tokenCheck,
} = require("../middleware/index");
const {
  register,
  login,
  findAllUsers,
  updateUsername,
  deleteUser,
} = require("./controllers");

userRouter.post("/register", hashPass, register);

userRouter.post("/login", comparePassword, login);

userRouter.get("/admin", tokenCheck, findAllUsers);

userRouter.put("/login/updateUsername", tokenCheck, updateUsername);

userRouter.delete("/login/delete", tokenCheck, deleteUser);

module.exports = userRouter;
