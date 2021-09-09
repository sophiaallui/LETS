"use strict";

const express = require('express');
const app = express();
const cors = require('cors');

const { NotFoundError } = require("./ExpressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const friendsRoutes = require("./routes/friendsRoutes");
const postCommentRoutes = require("./routes/postsCommentRoute");
const postRoutes = require("./routes/postRoutes");

app.use(cors());
app.use(express.json());
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/friends", friendsRoutes);
app.use("/comments", postCommentRoutes);
app.use("/posts", postRoutes);
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
