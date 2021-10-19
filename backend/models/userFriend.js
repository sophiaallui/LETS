const db = require("../db");
const { NotFoundError, BadRequestError } = require("../ExpressError");

class UserFriend {

  // Gets all confirmed friends about that username.
  static async getAllFrom(username) {
    const res = await db.query(
      `SELECT * 
        FROM users_friends
        WHERE 
          user_from = $1 OR 
          user_to = $2
          GROUP BY user_from, user_to
           HAVING 
          confirmed = 1`,
      [username, username]
    );
    return res.rows;
  }

  static async getAllBy(username) {
    const res = await db.query(
      `SELECT * FROM users_friends JOIN users ON users_friends.user_to = users.username
      WHERE user_from = $1
       AND confirmed = 0`
       ,[username]
    );
    for(const row of res.rows) {
      if(row.password) {
        delete row.password 
      }
    }
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
    const checkIfRequestWasSentAlready = await db.query(
      `SELECT * FROM users_friends WHERE user_from = $1 AND user_to = $2 AND confirmed = 0`, [userTo, userFrom]
    );
    if(checkIfRequestWasSentAlready.rows[0]) {
      const res = await this.confirmFriendRequest(userTo, userFrom);
      return res
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
    const checkIfUserFromExists = await db.query(
      `SELECT username FROM users WHERE username = $1`, [userFrom]
    );
    if (!checkIfUserFromExists.rows.length) {
      throw new NotFoundError(`User ${userFrom} does not exist`);
    };;
    const checkIfUserToExists = await db.query(
      `SELECT username FROM users WHERE username = $1`, [userTo]
    );
    if(!checkIfUserToExists.rows.length) {
      throw new NotFoundError(`User ${userTo} does not exist`)
    };

    
    const results = await db.query(
      `UPDATE users_friends
       SET confirmed = 1
       WHERE user_from = $1
       AND user_to = $2
       RETURNING
        user_from AS "userFrom",
        user_to AS "userTo",
        request_time AS "requestTime",
        confirmed
        `, [userFrom, userTo]
    );
    return results.rows[0];
  };

  static async cancelFriendRequest(userFrom, userTo) {
    const res = await db.query(`
      DELETE FROM users_friends WHERE user_from = $1 AND user_to = $2 RETURNING *
    `, [userFrom, userTo])
    return res.rows[0];
  };
}



module.exports = UserFriend;