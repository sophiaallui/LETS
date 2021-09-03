"use strict";

const express = require('express');
const app = express();
const cors = require('cors');

const { NotFoundError } = require("./ExpressError");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

/** Handle 404 errors -- this matches everything */
app.use((req, res, next) => {
  return next(new NotFoundError());
});

app.use((err, req, res, next) => {
  if(process.env.NODE_ENV !== 'test') {
    console.error(err.stack)
  }
  const status = err.status || 500;
  const message = err.message;
  return res.status(status).json({
    error : { message, status }
  })
})

module.exports = app;
