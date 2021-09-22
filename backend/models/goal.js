const db = require("../db");
const { NotFoundError, BadRequestError } = require("../ExpressError");

class Goal {
  static async getAll() {
    const res = await db.query(
      `SELECT id,
              created_by AS "createdBy"
              content,
              due_date AS "dueDate",
              is_complete AS "isComplete"
                FROM goals`
    );
    return res.rows;
  }
  static async getByUsername(username) {
    const checkIfUserExists = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
    if(!checkIfUserExists.rows.length) throw new NotFoundError(`No user : ${username}`)
    const res = await db.query(
      `SELECT id,
              created_by AS "createdBy"
              content,
              due_date AS "dueDate",
              is_complete AS "isComplete"
                FROM goals WHERE created_by = $1`, [username]
    );
    return res.rows;
  }
  
  static async create(username, data) {
    const checkIfUserExists = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
    if(!checkIfUserExists.rows.length) throw new NotFoundError(`No user : ${username}`)
    const res = await db.query(
      `INSERT INTO goals 
        (created_by, content, due_date, is_complete) VALUES
        ($1, $2, $3, $4) RETURNING
        id,
        created_by AS "createdBy",
        content,
        due_date AS "dueDate",
        is_complete AS "isComplete"`, 
        [username, data.content, data.dueDate, data.isComplete]
    );
    return res.rows[0];
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      content : "content",
      created_by : "createdBy", 
      due_date : "dueDate",
      is_complete : "isComplete"   
    });
    const idIndex = `$${values.length + 1}`
    const querySQL = `UPDATE goals
    SET ${setCols}
    WHERE id = ${idIndex}
    RETURNING id, created_by AS "createdBy", content, due_date AS "dueDate", is_complete AS "isComplete"`;

    const res = await db.query(querySQL, [...values, id]);
    const goal = res.rows[0];
    if(!goal) throw new BadRequestError();
    
    return goal;
  };

  static async delete(id) {
    const res = await db.query(
      `DELETE FROM goals WHERE id = $1 RETURNING id`, [id]
    );
    if(!res.rows[0]) throw new NotFoundError(`Goal id ${id} does not exist`);
  }
};

module.exports = Goal;