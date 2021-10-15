const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../ExpressError");
const { sqlForPartialUpdate } = require("../helpers/sqlForPartialUpdate");

class Post {
  static async create(username, data) {
    const checkIfUserExists = await db.query(`SELECT username FROM users WHERE username = $1`, [username]);
    if (!checkIfUserExists.rows.length) throw new NotFoundError(`User : ${username} does not exist`);
    const res = await db.query(
      `INSERT INTO posts
      (posted_by, content, image)
      VALUES 
      ($1, $2, $3) RETURNING
        id,
        posted_by AS "postedBy",
        content,
        created_at AS "createdAt",
        image`, 
        [username, data.content, data.image]
    );
    return res.rows[0];
  };

  static async getByUsername(username) {
    const res = await db.query(
      `SELECT 
        id,
        posted_by AS "postedBy",
        content,
        created_at AS "createdAt",
        image
        FROM posts WHERE posted_by = $1`, [username]
    );
    const post = res.rows[0];
    if (!post) throw new NotFoundError(`PostId ${id} does not exist`);

    const comments = await db.query(
      `SELECT id, post_id AS "postId", posted_by AS "postedBy", content, created_at AS "createdAt"
      FROM posts_comments WHERE post_id = $1`, [id]
    );

    post.comments = comments.rows;
    if(post.comments[0]) {
      for(let comment of post.comments) {
        const commentId = comment.id;
        const postCommentsComments = await db.query(
          `SELECT 
            id, 
            post_id AS "postId", 
            post_comments_id AS "postCommentsId", 
            posted_by AS "postedBy", 
            content, 
            created_at AS "createdAt"
          FROM 
          posts_comments_comments WHERE post_id = $1 AND post_comments_id = $2`, [id, commentId]
        );
        comment.comments = postCommentsComments.rows;
      }
    } 
    return post;
  };

  static async getAll() {
    const res = await db.query(`SELECT 
    id,
    posted_by AS "postedBy",
    content,
    created_at AS "createdAt",
    image
    FROM posts`);
    if(res.rows[0]) {
      for(let post of res.rows) {
        const postId = post.id;
        const comments = await db.query(`SELECT * FROM posts_comments WHERE post_id = $1`, [postId]);
        if(comments.rows[0]) {
          post.comments = comments.rows;
          for(let comment of post.comments) {
            const commentId = comment.id
            const commentsComments = await db.query(`SELECT * FROM posts_comments_comments WHERE post_id = $1 AND post_comments_id = $2`, [postId, commentId]);
            if(commentsComments.rows.length) {
              comment.comments = commentsComments.rows
            } else {
              comment.comments = [];
            }
          }
        }
      }
    }
    return res.rows;
  }

  static async getById(id) {
    const res = await db.query(
      `SELECT 
        id,
        posted_by AS "postedBy",
        content,
        created_at AS "createdAt",
        image
        FROM posts WHERE id = $1`, [id]
    );
    const post = res.rows[0];
    if (!post) throw new NotFoundError(`PostId ${id} does not exist`);

    const comments = await db.query(
      `SELECT id, post_id AS "postId", posted_by AS "postedBy", content, created_at AS "createdAt"
      FROM posts_comments WHERE post_id = $1`, [id]
    );

    post.comments = comments.rows;
    if(post.comments[0]) {
      for(let comment of post.comments) {
        const commentId = comment.id;
        const postCommentsComments = await db.query(
          `SELECT 
            id, 
            post_id AS "postId", 
            post_comments_id AS "postCommentsId", 
            posted_by AS "postedBy", 
            content, 
            created_at AS "createdAt"
          FROM 
          posts_comments_comments WHERE post_id = $1 AND post_comments_id = $2`, [id, commentId]
        );
        comment.comments = postCommentsComments.rows;
      }
    } 
    return post;
  };

  static async getAll() {
    const res = await db.query(`SELECT 
    id,
    posted_by AS "postedBy",
    content,
    created_at AS "createdAt",
    image
    FROM posts`);
    if(res.rows[0]) {
      for(let post of res.rows) {
        const postId = post.id;
        const comments = await db.query(`SELECT * FROM posts_comments WHERE post_id = $1`, [postId]);
        if(comments.rows[0]) {
          post.comments = comments.rows;
          for(let comment of post.comments) {
            const commentId = comment.id
            const commentsComments = await db.query(`SELECT * FROM posts_comments_comments WHERE post_id = $1 AND post_comments_id = $2`, [postId, commentId]);
            if(commentsComments.rows.length) {
              comment.comments = commentsComments.rows
            } else {
              comment.comments = [];
            }
          }
        }
      }
    }
    return res.rows;
  };

  static async update(username, postId, data) {
    const preCheck = await db.query(`SELECT id FROM posts WHERE id = $1`, [postId]);
    if(!preCheck.rows[0]) throw new NotFoundError(`Post ${postId} not found`);

    const { setCols, values } = sqlForPartialUpdate(data, {
      content : "content",
      created_at : "createdAt"    
    });
    const usernameVarIdx = "$" + (values.length + 1);
    const postIdVarIdx = "$" + (values.length + 2);

    const querySQL = `UPDATE posts
    SET ${setCols}
    WHERE posted_by = ${usernameVarIdx}
    AND id = ${postIdVarIdx}
    RETURNING id, posted_by AS "postedBy", content, created_at AS "createdAt"`;

    const res = await db.query(querySQL, [...values, username, postId]);
    const post = res.rows[0];
    if(!post) throw new BadRequestError();
    
    return post;
  };

  static async delete(username, postId) {
    const preCheck = await db.query(`SELECT id FROM posts WHERE id = $1`, [postId]);
    if(!preCheck.rows[0]) throw new NotFoundError(`Post with id : ${postId} does not exist`);
    
    await db.query(`DELETE FROM posts WHERE posted_by = $1 AND id = $2 RETURNING id`, [username, postId]);
  };
};

module.exports = Post;