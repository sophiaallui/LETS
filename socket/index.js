const REACT_APP_URL = "http://localhost:3000"
const config = {
  cors : {
    origin : REACT_APP_URL
  }
}
const io = require("socket.io")(8900, config);

/**
 *  SOCKET SERVER
 *  
 *    send Event To Client
 *     -> io
 * 
 *    To send every client
 *     -> io.emit
 * 
 *    To send one client
 *     -> io.to(socketID).emit
 * 
 *    Take event from client
 *     -> socket.on
 * 
 *  CLIENT
 *   Send event to server
 *    -> socket.emit
 * 
 *   Take event from server
 *    -> socket.on
 */

let users = [];

const addUser = (username, socketId) => {
  !users.some(user => user.username === username) &&
    users.push({ username, socketId })
};
const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
};
const getUser = username => {
  return users.find(user => user.username === username)
};


io.on("connection", socket => {
  console.log("a user connected.");
  
  // take username and socketId from user
  socket.on("addUser", username => {
    addUser(username, socket.id);
    io.emit("getUsers", users)
  });
  
  // send and get message
  socket.on("sendMessage", ({ senderUsername, receiverUsername, text}) => {
    const user = getUser(receiverUsername);

    io.to(user.socketId).emit("getMessage", { senderUsername, text })
  })  

  // when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });


});
