"use strict";

const express = require("express");
const router = express.Router();
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn} = require("../middleware/auth")
const Message = require("../models/message");
const { BadRequestError } = require("../ExpressError");
const db = require("../db");

// GET
// /messages/:roomId
// returns => [ { id, sentBy, text, createdAt, roomId}, { ... } ]
router.get("/:roomId", ensureLoggedIn, async (req, res, next) => {
  try {
    const messages = await Message.getByRoomId(req.params.roomId);
    return res.json({ messages });
  }
  catch(e) {
    return next(e);
  }
})

/** POST /messages/:username
 *  accepts { text, roomId } via req.body
 */ 
 router.post("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try { 
    const { username } = req.params;
    if(!req.body.text || typeof req.body.text !== "string" ||!req.body.text.length) throw new BadRequestError();
    const message = await Message.send(username, req.body);
    return res.json({ message });
  } 
  catch(e) {
    return next(e);
  }
});

module.exports = router;