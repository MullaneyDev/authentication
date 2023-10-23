const { Router } = require("express");
const router = Router();

const fn1 = async (req, res, next) => {
  const example = {
    fn1: "Hello from fn1",
  };
  req.example = example;
  console.log(req.example)
  next()
};

const fn2 = async (req, res, next) => {
  req.example.fn2 = "Hello from fn2";
  console.log(req.example)
  next();
};

const fn3 = async (req, res, next) => {
  req.example.fn3 = "Hello from fn3";
  console.log(req.example);
  next();
};

const endFunc = async (req, res) => {
  console.log(req);
  req.example.endFunc = "goodbye"
  res.status(200).json({ message: "success", example: req.example });
};

router.post("/", fn1, fn2, fn3,endFunc);

module.exports = router;
