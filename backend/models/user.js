"use strict";

const db = require("../db");
const bcrypt = require("bcryptjs");
const {
  sqlForPartialUpdate,
  sqlForInsert,
  userMeasurementsJsToSql,
} = require("../helpers/sqlForPartialUpdate");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../ExpressError");
const UserFriend = require("./userFriend");
const { BCRYPT_WORK_FACTOR } = require("../config");
const CalendarEvent = require("./calendarEvent");

/** Related functions for user */
class User {
  /**  authenticate user with username, password.
   * Returns { username, first_name, last_name, email, is_admin }
   * Throws UnauthorizedError if user not found or wrong password.
   * */
  static async authenticate(username, password) {
    const results = await db.query(
      `SELECT username, password, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"
      FROM users WHERE username = $1`,
      [username]
    );
    const user = results.rows[0];
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  /**
   * Register user with data.
   * Returns { username, firstName, lastName, email, isAdmin }
   * Throws BadRequestError on duplicates.
   */
  static async register({
    username,
    email,
    password,
    firstName,
    lastName,
    isAdmin,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username FROM users WHERE username=$1`,
      [username]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username : ${username}`);
    }
    const hashedPW = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const results = await db.query(
      `INSERT INTO users (username, email, password, first_name, last_name, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin", profile_image AS "profileImage"`,
      [username, email, hashedPW, firstName, lastName, isAdmin]
    );
    const user = results.rows[0];
    return user;
  }

  /** Find all users.
   * Returns [{ username, firstName, lastName, email, isAdmin}, ...]
   */
  static async findAll(q) {
    let baseQuery = `SELECT username, email, first_name AS "firstName", last_name AS "lastName", profile_image AS "profileImage" FROM users`;
    let whereExpressions = [];
    let queryValues = [];

    // for each possible search term, add to whereExpressions and queryValues so we can generate SQL
    if(q.username) {
      queryValues.push(`%${q.username}%`)
      whereExpressions.push(`username ILIKE $${queryValues.length}`) // select * from users where username ilike %char% 
    }
    if(q.firstName) {
      queryValues.push(`%${q.firstName}%`);
      whereExpressions.push(`first_name ILIKE $${queryValues.length}`)
    }
    if(q.lastName) {
      queryValues.push(`%${q.lastName}%`);
      whereExpressions.push(`last_name ILIKE $${queryValues.length}`)
    }
    if(q.email) {
      queryValues.push(`%${q.email}%`);
      whereExpressions.push(`email ILIKE $${queryValues.length}`)
    }
    if(whereExpressions.length > 0) {
      baseQuery += " WHERE "
    }

    const finalQuery = baseQuery + whereExpressions.join(" OR ")
    const results = await db.query(finalQuery, queryValues);
    return results.rows;
  }

  /**Given a username, return data about the user.
   * Returns { username, email, firstName, lastName, isAdmin }
   * Throws NotFoundError if the user is not found.
   */
  static async get(username) {
    const userResults = await db.query(
      `SELECT 
      username, 
      email, 
      first_name AS "firstName", 
      last_name AS "lastName", 
      is_admin AS "isAdmin",
      profile_image AS "profileImage"
        FROM users WHERE username = $1`,
      [username]
    );
    const user = userResults.rows[0];
    if (!user) {
      throw new NotFoundError(`No user : ${username}`);
    }
    const userPosts = await db.query(
      `SELECT id, posted_by AS "postedBy", content, created_at AS "createdAt", image FROM posts WHERE posted_by = $1`, [user.username]
    );
    const userMeasurements = await db.query(
      `SELECT 
        id,
        created_by AS "createdBy",
        height_in_inches AS "heightInInches",
        weight_in_pounds AS "weightInPounds",
        arms_in_inches AS "armsInInches",
        legs_in_inches AS "legsInInches",
        waist_in_inches AS "waistInInches"
        FROM users_measurements
        WHERE created_by = $1`,
      [user.username]
    );
    const userGoals = await db.query(
      `SELECT 
        id, 
        created_by AS "createdBy", 
        content, 
        due_date AS "dueDate", 
        is_complete AS "isComplete" 
          FROM goals 
            WHERE created_by = $1`, [user.username]
    );
    const userFriends = await UserFriend.getAllFrom(user.username);
    const userCalendarEvents = await CalendarEvent.getAll(user.username);

    user.friends = userFriends;
    user.goals = userGoals.rows;
    user.posts = userPosts.rows;
    user.measurements = userMeasurements.rows;
    user.events = userCalendarEvents;
    return user;
  }

  /**
   * Update user data with `data`
   * This is a "partial update" -- it's fine if data doesn't contain all the fields; this only changes the provided ones.
   * Data can include :
   *   { username, email, password, firstName, lastName, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   */
  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }
    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
      profileImage : "profileImage"
    });
    const usernameVarIdx = "$" + (values.length + 1);
    const querySQL = `UPDATE users
                        SET ${setCols}
                        WHERE username = ${usernameVarIdx}
                        RETURNING username,
                                  email,
                                  first_name AS "firstName",
                                  last_name AS "lastName",
                                  is_admin AS "isAdmin"`;
    const results = await db.query(querySQL, [...values, username]);
    const user = results.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
    delete user.password;
    return user;
  }

  /**  Delete give user from database; returns undefined. */
  static async remove(username) {
    let result = await db.query(
      `DELETE FROM users
      WHERE username = $1
      RETURNING username`,
      [username]
    );
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /** Post measurements from `data`
   *  It's fine if data doesn't contain all the fields; this only changes the provided ones.
   *  Data can include : {
   *     heightInInches,
   *     weightInPounds,
   *     armsInInches,
   *     legsInInches,
   *     waistInInches,
   *  }
   */
  static async postMeasurements(username, data) {
    const userCheck = await db.query(
      `SELECT username FROM users WHERE username=$1`,
      [username]
    );
    const user = userCheck.rows[0];
    if (!user) {
      throw new NotFoundError(`User: ${username} not found`);
    }
    const { baseQuery, values } = sqlForInsert(
      data,
      userMeasurementsJsToSql,
      "users_measurements"
    );
    console.log(baseQuery, values)
    const measurementsResults = await db.query(
      `${baseQuery} RETURNING
       id,
       created_by AS "createdBy",
       height_in_inches AS "heightInInches",
       weight_in_pounds AS "weightInPounds",
       arms_in_inches AS "armsInInches",
       legs_in_inches AS "legsInInches",
       created_at AS "createdAt"
      `,
      values
    );
    const userMeasurements = measurementsResults.rows[0];
    return userMeasurements;
  }

  static async deleteMeasurements(username, measurementId) {
    const results = await db.query(
      `DELETE FROM user_measurements
        WHERE created_by = $1 AND id = $2
        RETURNING id
      `,
      [username, measurementId]
    );
    const deleted = results.rows[0];
    if (!deleted) {
      throw new NotFoundError();
    }
  }

  static async getMeasurements(username) {
    const results = await db.query(
      `SELECT 
        id,
        created_by AS "createdBy",
        height_in_inches AS "heightInInches",
        weight_in_pounds AS "weightInPounds",
        arms_in_inches AS "armsInInches",
        legs_in_inches AS "legsInInches",
        waist_in_inches AS "waistInInches"
        FROM users_measurements
        WHERE created_by = $1`,
      [username]
    );
    const measurements = results.rows;
    if (measurements.length <= 0) {
      throw new NotFoundError(`User ${username} has no measurements`);
    }
    return measurements;
  }

  static async getMeasurement(username, measurementId) {
    const userCheck = await db.query(`SELECT username FROM users WHERE username = $1`, [username]);
    if(!userCheck.rows.length) throw new NotFoundError(`User ${username} does not exist`);
    const results = await db.query(
      `SELECT 
        id,
        created_by AS "createdBy",
        height_in_inches AS "heightInInches",
        weight_in_pounds AS "weightInPounds",
        arms_in_inches AS "armsInInches",
        legs_in_inches AS "legsInInches",
        waist_in_inches AS "waistInInches"
        FROM users_measurements
        WHERE created_by = $1
        AND id = $2`,
      [username, measurementId]
    );
    const measurement = results.rows[0];
    if (!measurement) {
      throw new NotFoundError(`id: ${measurementId} not found`);
    }
    return measurement;
  }

  static async updateMeasurement(username, data, measurementId) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      userMeasurementsJsToSql
    );
    const usernameVarIdx = `$${values.length + 1}`;
    const measurementIdIdx = `$${values.length + 2}`;
    const querySQL = `
      UPDATE users_measurements
            SET ${setCols}
            WHERE created_by = ${usernameVarIdx} AND
            id = ${measurementIdIdx}
            RETURNING 
                id,
                created_by AS "createdBy",
                height_in_inches AS "heightInInches",
                weight_in_pounds AS "weightInPounds",
                arms_in_inches AS "armsInInches",
                legs_in_inches AS "legsInInches",
                waist_in_inches AS "waistInInches"`;
    const results = await db.query(querySQL, [
      ...values,
      username,
      measurementId,
    ]);
    const updatedMeasurement = results.rows[0];
    if (!updatedMeasurement) {
      throw new NotFoundError(`No measurement : ${measurementId}`);
    }
    return updatedMeasurement;
  }

}

module.exports = User;
