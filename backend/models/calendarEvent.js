const db = require("../db");
const { NotFoundError, BadRequestError } = require("../ExpressError");

class CalendarEvent {
  static async getAll(username) {
    const res = await db.query(
      `SELECT
        id,
        event_title AS "eventTitle",
        event_description AS "eventDescription",
        start_date AS "startDate",
        end_date AS "endDate",
        radios FROM calendar_event
         WHERE posted_by = $1
        `, [username]
    );
    return res.rows;
  };
  static async getById(id) {
    const res = await db.query(
      `SELECT
        id,
        event_title AS "eventTitle",
        event_description AS "event_description"
        start_date AS "startDate",
        end_date AS "endDate",
        radios FROM calendar_event
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
          event_title AS "eventTitle",
          event_description AS "event_description"
          start_date AS "startDate",
          end_date AS "endDate",
          radios`, [username, data.eventTitle, data.eventDescription, data.startDate, data.endDate, data.radios]
    );
    if(!res.rows[0]) throw new BadRequestError();
    return res.rows[0]
  };

  
}

module.exports = CalendarEvent;