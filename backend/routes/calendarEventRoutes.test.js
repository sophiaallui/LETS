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

describe("GET /calendar-events/[username]", function () {
  test("works for admin", async () => {

    const res = await request(app)
      .get("/calendar-events/test11")
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      events: [
        {
          id: 1,
          eventTitle: 'test11s title',
          eventDescription: null,
          startDate: '2021-10-31T07:00:00.000Z',
          endDate: '2021-11-01T07:00:00.000Z',
          className: 'bg-info'
        }
      ]
    })
  });

  test("works for same as :username", async () => {
    const res = await request(app).get("/calendar-events/test22").set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      events: [
        {
          id: 2,
          eventTitle: 'test22s title',
          eventDescription: null,
          startDate: '2021-10-31T07:00:00.000Z',
          endDate: '2021-11-01T07:00:00.000Z',
          className: 'bg-danger'
        }
      ]
    })
  })

  test("Unauth for invalid users", async () => {
    const res = await request(app).get("/calendar-events/test22").set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toBe(401)
  });

  test("Unauth for anons", async () => {
    const res = await request(app).get("/calendar-events/test22")
    expect(res.statusCode).toBe(401)
  })
});

describe("GET /calendar-events/id/[id]", () => {
  test("works for admin:", async () => {
    const res = await request(app).get("/calendar-events/id/1").set("authorization", `Bearer ${adminToken}`);
    console.log(res.body)
  });
  test("works for signedIn users", async () => {
    const res1 = await request(app).get("/calendar-events/id/1").set("authorization", `Bearer ${test2Token}`);
    const res2 = await request(app).get("/calendar-events/id/1").set("authorization", `Bearer ${test3Token}`);
    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
  });
  test("Unauth for anon", async () => {
    const res = await request(app).get("/calendar-events/id/1");
    expect(res.statusCode).toBe(401)
  });
});

describe("POST /calendar-events/[username]", () => {
  const data = {
    eventTitle: "some title",
    eventDescription: "test desc",
    startDate: "9/30/2021",
    endDate: "10/1/2021",
    radios: "bg-info"
  };
  test("works for admin:", async () => {
    const res = await request(app).post("/calendar-events/test22").send(data)
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      event: {
        id: expect.any(Number),
        eventTitle: 'some title',
        eventDescription: 'test desc',
        startDate: expect.any(String),
        endDate: expect.any(String),
        className: 'bg-info'
      }
    })
  });

  test("works for same-as:username", async () => {

    const res = await request(app).post("/calendar-events/test22").send(data)
      .set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({
      event: {
        id: expect.any(Number),
        eventTitle: 'some title',
        eventDescription: 'test desc',
        startDate: expect.any(String),
        endDate: expect.any(String),
        className: 'bg-info'
      }
    })
  });

  test("unauth for invalid users", async () => {
    const res = await request(app).post("/calendar-events/test22").send(data)
      .set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401)
  });

  test("unauth for anons", async () => {
    const res = await request(app).post("/calendar-events/test22").send(data)
    expect(res.statusCode).toEqual(401)
  });
})

describe("DELETE /calendar-events/[username]/[id]", () => {
  test("works for admin:", async () => {
    const res = await request(app).delete("/calendar-events/test11/2").set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({ deleted: "2" })
  });

  test("works for valid users:", async () => {
    const res = await request(app).delete("/calendar-events/test22/2").set("authorization", `Bearer ${test2Token}`);
    expect(res.body).toEqual({ deleted: "2" })
  });

  test("Unauth for invalid users:", async () => {
    const res = await request(app).delete("/calendar-events/test22/2").set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("Unauth for anons", async () => {
    const res = await request(app).delete("/calendar-events/test22/2");
    expect(res.statusCode).toEqual(401);
  });
});

describe("PUT /calendar-events/[username]/[id]", () => {
  test("works for admin:", async () => {
    const res = await request(app)
      .put("/calendar-events/test22/2")
      .send({
        eventDescription: "testing description"
      })
      .set("authorization", `Bearer ${adminToken}`);

    expect(res.body).toEqual({
      event: {
        id: 2,
        eventTitle: 'test22s title',
        eventDescription: 'testing description',
        startDate: '2021-10-31T07:00:00.000Z',
        endDate: '2021-11-01T07:00:00.000Z',
        className: 'bg-danger'
      }
    })
  });

  test("works for same-as:username:", async () => {
    const res = await request(app)
      .put("/calendar-events/test22/2")
      .send({
        eventDescription: "testing description",
        eventTitle: "change to this lmao"
      })
      .set("authorization", `Bearer ${test2Token}`);

    expect(res.body).toEqual({
      event: {
        id: 2,
        eventTitle: 'change to this lmao',
        eventDescription: 'testing description',
        startDate: '2021-10-31T07:00:00.000Z',
        endDate: '2021-11-01T07:00:00.000Z',
        className: 'bg-danger'
      }
    })
  })

  test("Unauth for invalid users", async () => {
    const res = await request(app)
      .put("/calendar-events/test22/2")
      .send({
        eventDescription: "testing description",
        eventTitle: "change to this lmao"
      })
      .set("authorization", `Bearer ${test3Token}`);
    expect(res.statusCode).toEqual(401)
  });

  test("Unauth for anons", async () => {
    const res = await request(app).put("/calendar-events/test22/2").send({
      eventDescription : "some shit"
    });
    expect(res.statusCode).toEqual(401)
  })
})