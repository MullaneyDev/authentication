const { Router } = require("express");
const userRouter = Router();

const {
  hashPass,
  comparePassword,
  tokenCheck,
  validateEmail,
} = require("../middleware/index");
const {
  register,
  login,
  findAllUsers,
  updateUsername,
  deleteUser,
} = require("./controllers");

userRouter.post("/register", validateEmail, hashPass, register);

userRouter.post("/login", comparePassword, login);

userRouter.get("/admin",tokenCheck, findAllUsers); 

userRouter.get("/authCheck", tokenCheck, login)

userRouter.put("/login/updateUsername",  tokenCheck, updateUsername); 

userRouter.delete("/login/delete", tokenCheck, deleteUser);

module.exports = userRouter;
