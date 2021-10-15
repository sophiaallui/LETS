"use strict";

const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors');
const morgan = require("morgan");
const { NotFoundError } = require("./ExpressError");
const { authenticateJWT, ensureLoggedIn } = require("./middleware/auth");

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

// ROUTES for chat + rooms
const roomRoutes = require("./routes/roomRoutes");
const db = require('./knexDB');

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
app.use("/goals", goalRoutes);
app.use("/calendar-events", calendarRoutes);

app.use("/room", roomRoutes);

const storage = multer.diskStorage({
	destination : (req, file, cb) => {
		cb(null, "public/images");
	},
	filename : (req, file, cb) => {
		cb(null, req.body.name) // public/images/req.body.name
	},
});

const upload = multer({ storage : storage });
app.post("/api/images", upload.single("file"), async (req, res, next) => {
	try {
		console.log(req.file)
		const { filename, mimetype, size } = req.file;
		const { username } = res.locals.user
		const filepath = req.file.path;
		
		const fileResult = await knexDB.insert({ 
			filename, 
			filepath, 
			mimetype, 
			size,
			username,
		}).into("image_files");

		return res.json({ success : true, filename })
	}
	catch(e) {
		return next(e);
	}
})

app.get("/api/images/:filename", (req, res) => {
	const { filename } = req.params;
	db.select("*")
		.from("image_files")
		.where({ filename })
		.then(images => {
			if(images[0]) {
				const dirname = path.resolve();
				const fullfilepath = path.join(dirname, images[0].filepath);
				return res.type(images[0].mimetype).sendFile(fullfilepath)
			}
			return Promise.reject(new NotFoundError())
		})
		.catch(e => {
			throw new NotFoundError(e.stack)
		})
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
