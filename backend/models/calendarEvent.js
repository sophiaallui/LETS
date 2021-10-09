const db = require("../db");
const { NotFoundError, BadRequestError } = require("../ExpressError");
const { sqlForPartialUpdate } = require("../helpers/sqlForPartialUpdate");


class CalendarEvent {

  static async getAll(username) {
    const res = await db.query(
      `SELECT
        id,
        event_title AS "eventTitle",
        event_description AS "eventDescription",
        start_date AS "start",
        end_date AS "end",
        radios AS "className" 
          FROM calendar_event
         WHERE posted_by = $1
        `, [username]
    );
    return res.rows;
  };

  static async getById(id) {
    const res = await db.query(
      `SELECT
        id,
        event_title AS "title",
        event_description AS "description",
        start_date AS "start",
        end_date AS "end",
        radios AS "backgroundColor" 
        FROM calendar_event
         WHERE id = $1
        `,
        [id]
    );
    const event = res.rows[0];
    if(!event) throw new NotFoundError(`Calendar event id ${id} does not exist`);
    return event;
  };
  
  static async create(username, data) {
    const preCheck = await db.query(`SELECT username FROM users WHERE username = $1`, [username])
    if(!preCheck.rows.length) throw new NotFoundError();
    const res = await db.query(
      `INSERT INTO calendar_event
        (posted_by, event_title, event_description, start_date, end_date, radios)
         VALUES
         ($1, $2, $3, $4, $5, $6)
          RETURNING
          id,
          event_title AS "title",
          event_description AS "description",
          start_date AS "start",
          end_date AS "end",
          radios AS "backgroundColor" `, 
          [
            username, 
            data.title, 
            data.description, 
            data.start, 
            data.end, 
            data.backgroundColor
          ]
    );
    const event = res.rows[0]
    if(!event) throw new BadRequestError();
    return event
  };

  static async deleteById(id) {
    const res = await db.query(
      `DELETE FROM calendar_event WHERE id = $1 RETURNING id`, [id]
    );
    if(!res.rows[0]) throw new NotFoundError(`Calendar id ${id} does not exist`)
  };

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
          postedBy : "posted_by",
          eventTitle : "event_title",
          eventDescription : "event_description",
          startDate : "start_date",
          endDate : "end_date",
          radios : "radios"
        });
    const idIndex = `$${values.length + 1}`
    const querySQL = `UPDATE calendar_event
        SET ${setCols}
        WHERE id = ${idIndex}
        RETURNING
          id,
          event_title AS "title",
          event_description AS "description",
          start_date AS "start",
          end_date AS "end",
          radios AS "backgroundColor"`;

    const res = await db.query(querySQL, [...values, id]);
    const event = res.rows[0];
    if (!event) throw new BadRequestError();
    return event;
  }
}

module.exports = CalendarEvent;