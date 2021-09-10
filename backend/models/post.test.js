"use strict";
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../routes/_testCommon");
const Post = require("./post");
const db = require("../db");
const { NotFoundError, BadRequestError } = require("../ExpressError");
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Post.create(username, content)", () => {
  test("works", async () => {
    const res = await Post.create("test22", "testContent");
    expect(res).toEqual({
      id: expect.any(Number),
      postedBy: "test22",
      content: "testContent",
      createdAt: expect.any(Date),
    });
  });

  test("not found error if username does not exist", async () => {
    try {
      await Post.create("I DONT EXIST", "testContent");
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("Post.getById", () => {
  test("works", async () => {
    const res = await Post.getById(1);
    expect(res).toEqual({
      id: 1,
      postedBy: "test22",
      content: "testContent1",
      createdAt: expect.any(Date),
      comments: [
        {
          id: 1,
          postId: 1,
          postedBy: "test33",
          content: "this post sucks",
          createdAt: expect.any(Date),
          comments: [],
        },
      ],
    });
  });

  test("NotFoundError if postId doesnt exist", async () => {
    try {
      await Post.getById(88888);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("Post.getAll()", () => {
  test("works", async () => {
    const res = await Post.getAll();
    expect(res).toEqual([
      {
        content: "testContent11",
        comments: [
          {
            comments: [],
            content: "this post sucks",
            created_at: expect.any(Date),
            id: 1,
            post_id: 1,
            posted_by: "test33",
          },
        ],
        content: "testContent1",
        createdAt: expect.any(Date),
        id: 1,
        postedBy: "test11",
        postedBy: "test22",
      },
      {
        comments: [
          {
            comments: [],
            content: "yours suck too",
            created_at: expect.any(Date),
            id: 2,
            post_id: 2,
            posted_by: "test22",
          },
          {
            comments: [],
            content: "testContent22",
            content: "testingComment",
            created_at: expect.any(Date),
            id: 3,
            post_id: 2,
            posted_by: "test22",
          },
        ],
        content: "testContent2",
        createdAt: expect.any(Date),
        id: 2,
        postedBy: "test22",
        postedBy: "test33",
      },
    ]);
  });
});

describe("Post.update", () => {
  test("works", async () => {
    const res = await Post.update("test22", 1, { content: "update to this" });
    expect(res).toEqual({
      id: 1,
      postedBy: "test22",
      content: "update to this",
      createdAt: expect.any(Date),
    });
  });

  test("Notfound error if post does not exist", async () => {
    try {
      await Post.update("test11", 88888, { content: "LMAOO" });
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });

  test("BadRequesterror for invalid inputs", async () => {
    try {
      await Post.update("test11", 1, {});
      fail();
    } catch (e) {
      console.log(e)
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("Post.delete(username, postId)", () => {
  test("works", async () => {
    await Post.delete("test22", 1);
    const checkIfExists = await db.query(`SELECT * FROM posts WHERE id = $1`, [1]);
    expect(checkIfExists.rows.length).toEqual(0);
  });

  test("NotFoundError for non-existing posts", async () => {
    try {
      await Post.delete("test11", 99999);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});
