"use strict";

const express = require('express');
const app = express();
const wsExpress = require("express-ws")(app);
const cors = require('cors');
const morgan = require("morgan");
const { NotFoundError } = require("./ExpressError");
const { authenticateJWT } = require("./middleware/auth");
const { ChatUser } = require("./ChatUser");

const multer = require("multer");
const knexDB = require("./knexDB");

// ROUTES IMPORTS
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const friendsRoutes = require("./routes/userFriendsRoutes");
const postCommentRoutes = require("./routes/postsCommentRoutes");
const postRoutes = require("./routes/postRoutes");
const goalRoutes = require("./routes/goalRoutes");
const calendarRoutes = require("./routes/calendarEventRoutes");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(authenticateJWT);

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/friends", friendsRoutes);
app.use("/comments", postCommentRoutes);
app.use("/posts", postRoutes);
app.use("/images", imageRoutes);
app.use("/goals", goalRoutes);
app.use("/calendar-events", calendarRoutes);

const storage = multer.diskStorage({
	destination : (req, file, cb) => {
		cb(null, "public/images");
	},
	filename : (req, file, cb) => {
		cb(null, req.body.name)
	},
});

const upload = multer({ storage : storage });
app.post("/api/upload", upload.single("file"), (req, res, next) => {
	try {
		
	}
	catch(e) {
		return next(e);
	}
})


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
