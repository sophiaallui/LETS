"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../ExpressError");

class Message {

  static async send(sent_by, sent_to, message) {
    /**
     * 
     * @param {String from req.params.username} sent_by 
     * @param {String from req.params.toUsername} sent_to 
     * @param {String from req.body.text} message 
     * @returns { sentBy, sentTo, text, createdAt }
     */
    // the id, and created_at is auto-generated for us.
    const results = await db.query(
      `INSERT INTO messages
        (sent_by, sent_to, text)
        VALUES
        ($1, $2, $3)
        RETURNING
          id,
          sent_by AS "sentBy",
          sent_to AS "sentTo",
          text,
          created_at AS "createdAt"
      `, [sent_by, sent_to, message]
    );
    const message = results.rows[0];
    if (!message) {
      throw new NotFoundError(`Username ${sent_by} or ${sent_to} not found`)
    }
    return message;
  };

  
};

module.exports = Message;
