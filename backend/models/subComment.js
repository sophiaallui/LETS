const db = require("../db");
const {
  NotFoundError, BadRequestError
} = require("../ExpressError");
// CREATE TABLE posts_comments_comments (
//   id SERIAL PRIMARY KEY,
//   post_id INT REFERENCES posts (id) ON DELETE CASCADE,
//   post_comments_id INT REFERENCES posts_comments (id) ON DELETE CASCADE,
//   posted_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
//   content TEXT NOT NULL,
//   created_at TIMESTAMP NOT NULL DEFAULT NOW()
// );
class SubComment {

  // GET /comments/:postId/:username/:commentId/subcomments
  static async getAll() {
    const results = await db.query(
      `SELECT 
        id
        post_id AS "postId",
        post_comments_id AS "postCommentsId",
        posted_by AS "postedBy",
        content
        created_at  AS "createdAt"
        FROM posts_comments_comments`
    );
    return results.rows;
  }

  // GET /comments/:postId/:username/:commentId/subcomments/:subcommentId
  static async getOne(subcommentId) {
    const results = await db.query(
      `SELECT 
      id
      post_id AS "postId",
      post_comments_id AS "postCommentsId",
      posted_by AS "postedBy",
      content
      created_at  AS "createdAt"
      FROM posts_comments_comments
        WHERE id = $1
      `, [subcommentId]
      );
    const subComment = results.rows[0];
    if(!subComment) throw new NotFoundError(`Subcomment ${subcommentId} does not exist`);
    return subComment;
  };

  // POST /comments/:postId/:username/:commentId/subcomments
  static async create(postId, username, commentId, content) {
    const res = await db.query(
      `INSERT INTO posts_comments_comments
      (post_id, post_comments_id, posted_by, content)
      VAUES ($1, $2, $3, $4) RETURNING
        id
        post_id AS "postId",
        post_comments_id AS "postCommentsId",
        posted_by AS "postedBy",
        content
        created_at  AS "createdAt"
      `, [postId, commentId, username, content]
    );
    const subComment = res.rows[0];
    if(!subComment) throw new BadRequestError();
    return subComment;
  }
  
  // DELETE /comments/:postId/:username/:commentId/subcomments/:subcommentId
  // DELETE a subcomment by id
  static async deleteById(id) {
    const res = await db.query(
      `DELETE FROM posts_comments_comments WHERE id = $1 RETURNING id`, [id]
    );
    if(!res.rows[0]) throw new NotFoundError(`No SubComment : ${id}`);
  }
}

module.exports = SubComment