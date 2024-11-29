// import and intialize express
require("dotenv").config();
var express = require("express");
var cors = require("cors");
var app = express();

app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  var logMsg = `${req.ip} requested ${req.url}`;
  console.log(logMsg);
  next();
});

var lessonsRouter = require("./routes/lessons");
app.use("/lessons", lessonsRouter);

var ordersRouter = require("./routes/orders");
app.use("/orders", ordersRouter);

app.listen(8080);
