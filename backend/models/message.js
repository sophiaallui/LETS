"use strict";

const db = require("../db");
const {
  NotFoundError, BadRequestError,
} = require("../ExpressError");

class Message {

  static async send(sent_by, msg) {

    // the id, and created_at is auto-generated for us.
    const checkIfExists = await db.query(`SELECT username FROM users WHERE username = $1`, [sent_by]);
    if(!checkIfExists.rows[0]) {
      throw new NotFoundError(`User : ${sent_by} does not exist`)
    }
    if(!msg || msg.length < 0 || typeof msg !== "string") throw new BadRequestError();
    
    const results = await db.query(
      `INSERT INTO messages
        (sent_by, sent_to, text)
        VALUES
        ($1, $2, $3)
        RETURNING
          id,
          sent_by AS "sentBy",
          text,
          created_at AS "createdAt",
          room_id AS "roomId"
      `, [sent_by, sent_to, msg]
    );
    const message = results.rows[0];
    return message;
  };

  /** Delete message from the db based on the messageId
   *  NotFoundError if the message doesn't exist.
   *  Authorization required : admin or same-user-as:username
   */
   static async delete(messageId) {
     const results = await db.query(
       `DELETE FROM messages
       WHERE id = $1
       RETURNING id`,
       [messageId]
     );
     const message = results.rows[0];
     if(!message) {
       throw new NotFoundError();
     }
   }

   static async getByRoomId(roomId) {
     const res = await db.query(
       `SELECT 
          id,
          sent_by AS "sentBy",
          text,
          created_at AS "createdAt",
          room_id AS "roomId"
           FROM messages WHERE
             room_id = $1
              ORDER BY created_at`, [roomId]
     );
     return res.rows;
   }
};

module.exports = Message;
