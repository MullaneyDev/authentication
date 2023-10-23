require("dotenv").config();
const express = require("express");

const router = require("./middlewareExample")

const port = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use("/example", router)

app.get("/health", (req, res) => {
  req.json(200).json({ message: "API is healthy" });
});

app.listen(port, () => {
  console.log("App is listening");
});
