const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const db = require("../db");

// CREATE TABLE room (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(34),
//   type BOOLEAN
// );

// CREATE TABLE participants (
//   id SERIAL PRIMARY KEY,
//   user_id VARCHAR(25) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
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
router.post("/sender/:username", async (req, res, next) => {
	try {
		const { username } = req.params;
		const { receiverUsername } = req.body;

		const roomResults = await db.query(`INSERT INTO room (name) VALUES ($1) RETURNING *`, [receiverUsername]);
		const room = roomResults.rows[0];
		const participantsResults = await db.query(
			`INSERT INTO participants
			 (user_id, room_id) VALUES
			 ($1, $2),
			 ($3, $2) RETURNING *`,
			 [username, room.id, receiverUsername]
		);
		const finalQuery = await db.query(
			`SELECT * 
				from room 
					join participants on participants.room_id = $1`, 
			[room.id]
		)
		return res.status(200).json({ rooms : finalQuery.rows });
	}
	catch(e) {
		console.error(e)
		return next(e);
	}
});




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