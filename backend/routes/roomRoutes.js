const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const db = require("../db");


// new convo
// so new room is created, and adds participants
// returns => conversation : {
// 	id,
// 	name,
// 	members : [ username,  username ]
// }
router.post("/:username", async (req, res, next) => {
	try {
		const { recieverUsername } = req.body;
		const { username } = req.params;
		const newRoomResults = await db.query(
			`INSERT INTO rooms (name) VALUES ($1) RETURNING *`, [recieverUsername]
		);
		const newRoom = newRoomResults.rows[0];
		const participantsResults = await db.query(
			`INSERT INTO participants 
				(username, room_id) 
					VALUES ($1, $2), ($3, $4) RETURNING *`,
			[username, newRoom.id, recieverUsername, newRoom.id]
		)
		
		const finalResults = {
			roomId : newRoom.id,
			name : newRoom.name,
			members : participantsResults.rows.map(p => p.username)
		};
		return res.json({ conversation : finalResults })
	}
	catch (e) {
		return next(e);
	}
})

// get conversations of a user
// GET room/:username
router.get("/:username", async (req, res, next) => {
	try {
		const { username } = req.params;
		const participantsResults = await db.query(
			`SELECT * FROM `
		)
		return res.json({ conversations: roomResults.rows })
	}
	catch (e) {
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
		return res.json({ conversation: roomResults.rows })
	}
	catch (e) {
		return next(e);
	}
})

// delete room based on roomId.
router.delete("/:roomId", async (req, res, next) => {
	try {
		const res = await db.query(
			`DELETE FROM room WHERE id = $1`, [req.params.roomId]
		);
		return res.json({ deleted: req.params.roomId });
	}
	catch (e) {
		return next(e);
	}
})

module.exports = router;