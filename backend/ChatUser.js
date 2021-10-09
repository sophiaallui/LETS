// Functionality related to chatting.
// Chat rooms that can be joined/left/broadcast to.
// in-memory storage of roomNames -> room
const ROOMS = new Map();
// Room is a collection of listening members; this becomes a "chat room"
// where individual users can join/leave/broadcast to.
class Room {
	// get room by that name, creating if non-existent
	static get(roomName) {
		if(!ROOMS.has(roomName)) {
			ROOMS.set(roomName, new Room(roomName))
		}
		return ROOMS.get(roomName);
	}

	// make a new room, starting with empty set of listeners
	constructor(roomName) {
		this.name = roomName;
		this.members = new Set();		
	}

	// members joining a room
	join(member) {
		this.members.add(member);
	}

	// member leaving a room
	leave(member) {
		this.members.delete(member)
	}

	// send message to all members in a room
	broadcast(data) {
		for(let member of this.members) {
			member.send(JSON.stringify(data))
		}
	}
}

// ChatUser is a individual connection from client -> server to chat.
class ChatUser {
	// make chat: store connection-device, room
	constructor(send, roomName) {
		this._send = send; // "send" function for this user
		this.room = Room.get(roomName); // room user will be in
		this.name = null; // becomes the username of the visitor
		console.log(`created chat in ${this.room.name}`)
	}

	// send msgs to this client using underlying connection-send-function
	send(data) {
		try {
			this._send(data);
		}
		catch(e) {
			console.error(e);
		}
	}

	// handle joining : add to room members, announce join
	handleJoin(name) {
		this.name = name;
		this.room.join(this);
		this.room.broadcast({
			type : "note",
			text : `${this.name} joined ${this.room.name}`
		});
	}

	// handle a chat : broadcast to room.
	handleChat(text) {
		this.room.broadcast({
			name : this.name,
			type : "chat",
			text : text
		});
	}

	// handle messages from client
	// - { type : "join", name : username } : join
	// - { type : "chat", text : msg }      : chat
	handleMessage(jsonData) {
		let msg = JSON.parse(jsonData);
		if(msg.type === "join") {
			this.handleJoin(msg.name);
		}
		else if(msg.type === "chat") {
			this.handleChat(msg.text)
		}
		else {
			throw new Error(`bad message : ${msg.type}`)
		}
	}

	// Connection was closed: leave room, announce exit to others.
	handleClose() {
		this.room.leave(this);
		this.room.broadcast({
			type : "note",
			text : `${this.name} left ${this.room.name}`
		});
	}
}

module.exports = { Room, ChatUser }