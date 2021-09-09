"use strict";

const express = require("express");
const router = express.Router();
const { ensureCorrectUserOrAdmin, ensureAdmin} = require("../middleware/auth")
const Message = require("../models/message");
const { BadRequestError } = require("../ExpressError");

/** GET / =>  { messages : [{ id, sent_by, sent_to, text, created_at }] }
 *  Athorization required : admin.
 *  Returns { messages : [{ id, sent_by, sent_to, text, created_at }] }
 */ 
router.get("/", ensureAdmin, async (req, res, next) => {
  try {
    const messages = await Message.getAll();
    return res.json({ messages })
  } catch(e) {
    return next(e)
  }
})

/** POST /[username]/messages/[toUsername] 
 *  Authorization required : admin or same-user-as:username
 *  NotFoundError if the toUsername doesn't exist.
 *  BadRequestError if the input is not valid.
 *  Returns { message : { id, sentBy, sentTo, text, createdAt } }
 */ 
 router.post("/:username/to/:toUsername", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try { 
    const { username, toUsername } = req.params;
    if(!req.body.text || typeof req.body.text !== "string" ||!req.body.text.length) throw new BadRequestError();
    const message = await Message.send(username, toUsername, req.body.text);
    return res.json({ message })
  } 
  catch(e) {
    return next(e);
  }
});

/** DELETE /[username]/messages/[messageId] => { deleted : messageId }
 *  Authorization required : admin or same-user-as:username
 */
router.delete("/:username/delete/:messageId", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { messageId } = req.params;
    await Message.delete(messageId);
    return res.json({ deletedMessage : messageId });
  } catch(e) {
    return next(e);
  }
});

module.exports = router;