"use strict";

const express = require('express');
const app = express();
const wsExpress = require("express-ws")(app);
const cors = require('cors');
const morgan = require("morgan");
const { NotFoundError } = require("./ExpressError");
const { authenticateJWT } = require("./middleware/auth");
const { ChatUser } = require("./ChatUser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const friendsRoutes = require("./routes/userFriendsRoutes");
const postCommentRoutes = require("./routes/postsCommentRoutes");
const postRoutes = require("./routes/postRoutes");
const imageRoutes = require("./routes/imagesRoutes");
const goalRoutes = require("./routes/goalRoutes");
const calendarRoutes = require("./routes/calendarEventRoutes");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/friends", friendsRoutes);
app.use("/comments", postCommentRoutes);
app.use("/posts", postRoutes);
app.use("/images", imageRoutes);
app.use("/goals", goalRoutes);
app.use("/calendar-events", calendarRoutes);


// Web socket routes
/** Handle a persistent connection to /chat/[roomName]
 *
 * Note that this is only called *once* per client --- not every time
 * a particular websocket chat is sent.
 *
 * `ws` becomes the socket for the client; it is specific to that visitor.
 * The `ws.send` method is how we'll send messages back to that socket.
 */
app.ws("/chat/:roomName", async (ws, req, next) => {
	try {
		const { roomName } = req.params;
		const user = new ChatUser(ws.send.bind(ws), roomName);

		// register handlers for message-received, connection-closed 
		ws.on("message", async data => {
			// called when message is recieved from browser
			try {
				user.handleMessage(data);
			}
			catch(e) {
				console.error(e);
			}
		})

		ws.on("close", () => {
			// called when browser closes connection
			try {
				user.handleClose();
			} catch(e) {
				console.error(e);
			}
		})
	} 
	catch(e) {
		console.error(e)
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
