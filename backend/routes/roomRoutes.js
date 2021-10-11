const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const db = require("../db");

// CREATE TABLE room (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(34),
// );

// CREATE TABLE participants (
//   id SERIAL PRIMARY KEY,
//   username varchar(25) REFERENCES users(username) ON DELETE CASCADE,
//   room_id INT REFERENCES room(id) ON DELETE CASCADE
// );

// CREATE TABLE messages (
//   id SERIAL PRIMARY KEY,
//   sent_by VARCHAR(25) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
//   text TEXT NOT NULL,
//   room_id INT REFERENCES room(id) ON DELETE CASCADE,
//   created_at TIMESTAMP NOT NULL DEFAULT NOW()
// );



// new convo
// so new room is created, and adds participants
/**
 * conversation : {
 *   id, name, members : [username, username]
 * }
 */
router.post("/sender/:username", async (req, res, next) => {
	try {
		const { username } = req.params;
		const {receiverUsername } = req.body;
		const roomResults = await db.query(
			`INSERT INTO room (name) VALUES ($1) RETURNING *`, [receiverUsername]
		);
		const room = roomResults.rows[0];
		const participantsResults = await db.query(
			`INSERT INTO participants 
			(username, room_id) 
			VALUES ($1, $2), ($3, $4)
			  RETURNING username`,
			[username, room.id, receiverUsername, room.id]
		);

		const finalResults = {
			roomId : room.id,
			name : room.name,
			members : participantsResults.rows.map(r => r.username)
		}
		return res.json({ conversation : finalResults  })
	}
	catch(e) {
		return next(e);
	}
});

// get conversations of a user
// GET room/:username
router.get("/:username", async (req, res, next) => {
	try {
		const { username } = req.params;
		const participantsResults = await db.query(
			`SELECT DISTINCT room_id, username FROM participants WHERE username = $1`, [username]
		);
		
		const roomResultsPromise = participantsResults.rows.map(p => db.query(`SELECT * FROM room WHERE id = $1`, [p.room_id]))
		const roomResults = await roomResultsPromise;
		
		return res.json({ conversations : roomResults.rows })
	}
	catch(e) {
		return next(e);
	}
})

// get conversation which includes two usernames
router.get("/find/:username/:secondUsername", async (req, res, next) => {
	try {
		const { username, secondUsername } = req.params;
		
		const roomResults = await db.query(
			`SELECT * FROM room WHERE 
			  $1 = ANY (members) OR $2 = ANY (members)`,
			[username, secondUsername]
		);
		return res.json({ conversation : roomResults.rows })
	}
	catch(e) {
		return next(e);
	}
})

// delete room based on roomId.
router.delete("/:roomId", async (req, res, next) => {
	try {
		const res = await db.query(
			`DELETE FROM room WHERE id = $1`, [req.params.roomId]
		);
		return res.json({ deleted : req.params.roomId });
	}	
	catch(e) {
		return next(e);
	}
})

module.exports = router;