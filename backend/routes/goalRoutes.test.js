"use strict";
const request = require("supertest");
const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  test2Token,
  test3Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


describe("GET /goals/", () => {
  test("works if you're logged in", async () => {
    const res1 = await request(app).get("/goals").set("authorization", `Bearer ${adminToken}`)
    const res2 = await request(app).get("/goals").set("authorization", `Bearer ${test2Token}`)
    const res3 = await request(app).get("/goals").set("authorization", `Bearer ${test3Token}`)
    expect(res1.statusCode).toEqual(200)
    expect(res1.statusCode).toEqual(200)
    expect(res3.statusCode).toEqual(200)
  });
  test("Unauth for anons", async () => {
    const res = await request(app).get("/goals");
    expect(res.statusCode).toEqual(401)
  });
});

describe("GET /goals/[username]", () => {
  test("works for admin", async () => {
    const res = await request(app).get("/goals/test11").set("authorization", `Bearer ${adminToken}`)
    expect(res.body).toEqual({
      goals: [
        {
          id: 1,
          createdBy: 'test11',
          content: 'testing content',
          dueDate: '2021-11-17T11:24:00.000Z',
          isComplete: false
        },
        {
          id: 2,
          createdBy: 'test11',
          content: 'testing content2',
          dueDate: '2022-11-17T11:24:00.000Z',
          isComplete: false
        }
      ]
    })
  });

  test("works for same-as:username", async () => {
    const res = await request(app).get("/goals/test22").set("authorization", `Bearer ${test2Token}`)
    expect(res.body).toEqual({
      goals: [
        {
          "content": "bleh",
          "createdBy": "test22",
          "dueDate": "2022-12-17T11:24:00.000Z",
          "id": 3,
          "isComplete": true,
        }
      ]
    })
  });

  test("Unauth for invalid users", async () => {
    const res = await request(app).get("/goals/test11").set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("Unauth for anons", async () => {
    const res = await request(app).get("/goals/test11");
    expect(res.statusCode).toEqual(401);
  });
});

describe("POST /goals/[username]", () => {
  const data = {
    content: "Some shit",
    dueDate: "12/24/2021",
    isComplete: false
  };

  test("Works for admin", async () => {
    const res = await request(app).post("/goals/test22").send(data).set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      goal: {
        id: expect.any(Number),
        createdBy: "test22",
        content: data.content,
        dueDate: expect.any(String),
        isComplete: false
      }
    });
  });

  test("Works for same-as:username", async () => {
    const res = await request(app).post("/goals/test22").send(data).set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      goal: {
        id: expect.any(Number),
        createdBy: "test22",
        content: data.content,
        dueDate: expect.any(String),
        isComplete: false
      }
    });
  });

  test("Unauth for invalid users", async () => {
    const res = await request(app).post("/goals/test22").send(data).set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toBe(401);
  });

  test("Unauth for anons", async () => {
    const res = await request(app).post("/goals/test22").send(data);
    expect(res.statusCode).toBe(401);
  });
});

describe("PUT /goals/[username]/[goalId]", () => {
  test("works for admin", async () => {
    const res = await request(app).put("/goals/test11/1").send({
      content: "edit to this",
      dueDate: "12/1/2021"
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      goal: {
        id: 1,
        createdBy: "test11",
        content: "edit to this",
        dueDate: "2021-12-01T08:00:00.000Z",
        isComplete: false
      }
    })
  });

  test("works for same-as:username", async () => {
    const res = await request(app).put("/goals/test22/3").send({
      content: "edit to this",
      dueDate: "12/1/2021"
    })
    .set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      goal : {
        id: 3,
        createdBy: 'test22',
        content: 'edit to this',
        dueDate: '2021-12-01T08:00:00.000Z',
        isComplete: true
      }
    })
  });

  test("Unauth for invalid users", async () => {
    const res = await request(app).put("/goals/test22/3").send({
      content : "breh"
    })
    .set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401)
  });

  test("Unauth for anons", async () => {
    const res = await request(app).put("/goals/test22/3").send({
      content : "breh"
    });
    expect(res.statusCode).toEqual(401)
  });

  test("NotFoundError if goalID does not exist", async () => {
    const res = await request(app).put("/goals/test22/94894").send({
      content : "breh"
    }).set("authorization", `Bearer ${test2Token}`);
    expect(res.statusCode).toEqual(400)
  })
});

describe("DELETE /goals/[username]/[goalId]", () => {
  test("works for admin: ", async function() {
    const res = await request(app).delete("/goals/test22/3").set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({ deleted : "3" })
  });
  test("works for same-as-:username", async function() {
    const res = await request(app).delete("/goals/test22/3").set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({ deleted : "3" })
  });
  test("Unauth for invalid users", async () => {
    const res = await request(app).delete("/goals/test22/3").set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401)
  });
  test("Unauth for anons", async () => {
    const res = await request(app).delete("/goals/test22/3");
    expect(res.statusCode).toEqual(401)
  });
  test("NotFoundError for invalid goalId", async () => {
    const res = await request(app).delete("/goals/test11/894897498").set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404)
  })
})

