const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const db = require("../db");

// CREATE TABLE room (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(34),
//   type BOOLEAN,
// 	 members TEXT []
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
		const {receiverUsername } = req.body;
		const room = await db.query(
			`INSERT INTO room (name, members) VALUES
				(
					$1,
					ARRAY [$2, $3]
				) RETURNING *;`,
				[
					receiverUsername,
					username,
					receiverUsername
				]
		);
		return res.json({ conversation : room.rows[0] })
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
		const roomResults = await db.query(
			`SELECT * FROM room WHERE $1 = ANY (members)`, [username]
		);
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