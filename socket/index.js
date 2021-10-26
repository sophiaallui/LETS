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
let roomMembers = {};

const addUser = (username, socketId, roomId) => {
  !users.some(user => user.username === username) &&
    users.push({ username, socketId, roomId : null })
};

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
};

const getUser = username => {
  return users.find(user => user.username === username)
};

const addRoomInfo = (roomId, username) => {
  const foundIdx = users.findIndex(user => user.username === username && user.roomId !== roomId);
  foundIndex !== -1 ? users[foundIdx].roomId = roomId : null;
}

const getUserInfoByRoomId = (roomId) => {
  return users.filter(user => user.roomId === roomId);
}

const removeRoomInfo = (roomId, username) => {
  const foundIdx = users.findIndex(user => user.username === username && user.roomId === roomId);
  foundIndex !== -1 ? users[foundIdx].roomId = null : null;
}

io.on("connection", socket => {
  console.log("a user connected.");
  
  // take username and socketId from user
  socket.on("addUser", username => {
    addUser(username, socket.id);
    io.emit("getUsers", users)
  });

  socket.on("sendMessage", ({roomId, senderUsername, text}) => {
    io.to(roomId).emit("getMessage", { roomId, senderUsername, text })
  })

  socket.on("joinRoom", ({roomId, username}) => {
    socket.join(roomId)
    if(!roomMembers[roomId]) {
      roomMembers[roomId] = {
        roomId : roomId,
        members : [username]
      }
    } 
    else if(!roomMembers[roomId].members.includes(username)) {
      roomMembers[roomId].members.push(username)
    }
    console.log(roomMembers[roomId])
    io.to(roomId).emit("user-joined", roomMembers[roomId])
  }) 
    
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.on("leaveRoom", ({ roomId, username}) => {
    socket.leave(roomId);
    roomMembers[roomId].members = roomMembers[roomId].members.filter(u => u !== username);
    if(roomMembers[roomId].members.length === 0) {
      delete roomMembers[roomId]
    }
    console.log(`${username} left ${roomId}`)
  })

  socket.on("typing", ({ senderUsername, roomId }) => {
    console.log(`${senderUsername} is typing`);
    io.to(roomId).emit("getTyping", true)
  })

  socket.on("done-typing", (roomId) => {
    io.to(roomId).emit("done-typing", false)
  })
});
