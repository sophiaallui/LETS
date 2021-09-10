"use strict";
const request = require("supertest");
const app = require("../app");
const db = require("../db");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  test2Token,
  test3Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// GET /posts/
describe("/GET /posts", () => {
  test("works for any signed-in user", async () => {
    const res = await request(app)
      .get("/posts")
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      posts: [
        {
          comments: [
            {
              comments: [],
              content: "this post sucks",
              created_at: expect.any(String),
              id: 1,
              post_id: 1,
              posted_by: "test33",
            },
          ],
          content: "testContent1",
          createdAt: expect.any(String),
          id: 1,
          postedBy: "test22",
        },
        {
          comments: [
            {
              comments: [],
              content: "yours suck too",
              created_at: expect.any(String),
              id: 2,
              post_id: 2,
              posted_by: "test22",
            },
            {
              comments: [],
              content: "testingComment",
              created_at: expect.any(String),
              id: 3,
              post_id: 2,
              posted_by: "test22",
            },
          ],
          content: "testContent2",
          createdAt: expect.any(String),
          id: 2,
          postedBy: "test33",
        },
      ],
    });
  });

  test("unauth for anons", async () => {
    const res = await request(app).get("/posts");
    expect(res.statusCode).toEqual(401);
  });
});

// GET /posts/:postId
describe("/GET /posts/:postId", () => {
  test("works for admin", async () => {
    const res = await request(app).get("posts/1").set("authorization", `Bearer ${adminToken}`);
    console.log(res.body)
  })
})
