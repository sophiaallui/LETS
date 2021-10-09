const db = require("../db");
const { NotFoundError, BadRequestError } = require("../ExpressError");

class PostComment {
  static async getCommentsByPostId(postId) {
    const res = await db.query(
      `SELECT
        id,
        post_id AS "postId",
        posted_by AS "postedBy",
        content,
        created_at AS "createdAt" FROM posts_comments
        WHERE post_id = $1`,
      [postId]
    );
    return res.rows;
  }

  static async getAllComments() {
    const res = await db.query(`SELECT
    id,
    post_id AS "postId",
    posted_by AS "postedBy",
    content,
    created_at AS "createdAt" FROM posts_comments`);
    return res.rows;
  }

  static async createComment(username, postId, content) {
    const checkIfPostExists = await db.query(`SELECT id from posts WHERE id = $1`, [postId]);
    const post = checkIfPostExists.rows[0];
    if(!post) throw new NotFoundError(`Post ${postId} does not exist`);
    const res = await db.query(
      `INSERT INTO posts_comments
      (post_id, posted_by, content) VALUES ($1, $2, $3)
      RETURNING
        id,
        post_id AS "postId",
        posted_by AS "postedBy",
        content,
        created_at AS "createdAt"`,
      [postId, username, content]
    );
    if(!res.rows[0]) throw new BadRequestError();
    return res.rows[0];
  };

  static async deleteComment(postId, username, commentId)  {
    const checkIfExists = await db.query(`SELECT id from posts_comments WHERE id = $1`, [commentId])
    const comment = checkIfExists.rows[0];
    if(!comment) throw new NotFoundError(`Comment ${commentId} does not exist`);
    const res = await db.query(
      `DELETE FROM posts_comments 
        WHERE id = $1 AND
        post_id = $2 AND
        posted_by = $3
        RETURNING id`, [commentId, postId, username]);
    if(!res.rows[0]) throw new BadRequestError();
  }
}

module.exports = PostComment;
