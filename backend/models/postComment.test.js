"use strict";
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../routes/_testCommon");
const PostComment = require("./postComment");
const db = require("../db");
const { NotFoundError, BadRequestError } = require("../ExpressError");
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("PostComment.getCommentsByPostId", () => {
  test("works", async () => {
    const res = await PostComment.getCommentsByPostId(1);
    expect(res).toEqual([
      {
        id: 1,
        postId: 1,
        postedBy: "test33",
        content: "this post sucks",
        createdAt: expect.any(Date),
      },
    ]);
  });
});

describe("PostComment.getAllComments", () => {
  test("works", async () => {
    const res = await PostComment.getAllComments();
    expect(res).toEqual([
      {
        id: 1,
        postId: 1,
        postedBy: "test33",
        content: "this post sucks",
        createdAt: expect.any(Date),
      },
      {
        id: 2,
        postId: 2,
        postedBy: "test22",
        content: "yours suck too",
        createdAt: expect.any(Date),
      },
      {
        content: "testingComment",
        createdAt: expect.any(Date),
        id: 3,
        postId: 2,
        postedBy: "test22",
      },
    ]);
  });
});

describe("PostComment.createComment", () => {
  test("works", async () => {
    const newPost = await db.query(
      `INSERT INTO posts 
      (id, posted_by, content) VALUES 
      (99, 'test22', 'testingPost') RETURNING *` );
    const newPostId = newPost.rows[0].id
    const res = await PostComment.createComment("test22", newPostId, "testinggg");
    expect(res).toEqual({
      id: expect.any(Number),
      postId: newPostId,
      postedBy: "test22",
      content: "testinggg",
      createdAt: expect.any(Date),
    });
  });

  test("Not found error if post does not exist", async () => {
    try {
      await PostComment.createComment('test22', 9999, 'lmao');
      fail();
    } catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("PostComment.deleteComment", () => {
  test("works", async () => {
    await PostComment.deleteComment(2, "test22", 3);
    const verify = await db.query(`SELECT id FROM posts_comments WHERE id = 3`);
    expect(verify.rows.length).toEqual(0);
  });

  test("Not found error if no such comment", async () => {
    try {
      await PostComment.deleteComment(2, "test22", 9999);
      fail();
    } catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  })
});


