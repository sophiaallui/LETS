const db = require("../db");
const { NotFoundError, BadRequestError } = require("../ExpressError");

class UserFriend {

  // Gets all confirmed friends about that username.
  static async getAllFrom(username) {
    const res = await db.query(
      `SELECT * FROM users_friends
      WHERE user_from = $1 OR 
      user_to = $1 AND
      confirmed = $2`, 
      [username, 1]
    );
    return res.rows;
  }

  // Gets all friend requests that are pending username's confirmation.
  static async getAllPending(username) {
    const res = await db.query(
      `SELECT * FROM users_friends
        WHERE user_to = $1
        AND confirmed = $2`,
        [username, 0]
    );
    return res.rows;
  } 

  static async sendFriendRequest(userFrom, userTo) {
    const preCheck = await db.query(
      `SELECT username FROM users WHERE username = $1 OR username = $2`,
      [userFrom, userTo]
    );
    if (preCheck.rows.length !== 2) {
      throw new NotFoundError();
    }
    const results = await db.query(
      `INSERT INTO users_friends 
      (user_from, user_to) VALUES
      ($1, $2)
      RETURNING
        user_from AS "userFrom",
        user_to AS "userTo",
        request_time AS "requestTime",
        confirmed`,
      [userFrom, userTo]
    );
    const userFriendRequest = results.rows[0];
    if (!userFriendRequest) {
      throw new BadRequestError();
    }
    return userFriendRequest;
  };
  
  static async confirmFriendRequest(userFrom, userTo) {
    const preCheck = await db.query(
      `SELECT username FROM users WHERE username = $1 OR username = $2`,
      [userFrom, userTo]
    );
    if (preCheck.rows.length !== 2) {
      throw new NotFoundError();
    };
    const results = await db.query(
      `UPDATE users_friends
       SET confirmed = 1
       WHERE user_from = $1
       AND user_to = $2
       RETURNING *`, [userFrom, userTo]
    );
    return results.rows[0];
  };


}

module.exports = UserFriend;