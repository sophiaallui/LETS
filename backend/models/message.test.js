"use strict";
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../routes/_testCommon");
const Message = require("./message");
const db = require("../db");
const { NotFoundError, BadRequestError } = require("../ExpressError");
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** send */
describe("send", () => {
  test("works", async () => {
    const newMessage = await Message.send("test22", "test33", "testMsg");
    // id is autoincrementing, and timestamp will always be different based on when it was inserted.
    expect(newMessage).toEqual({
      id: expect.any(Number),
      sentBy: "test22",
      sentTo: "test33",
      text: "testMsg",
      createdAt: expect.any(Date),
    });
  });
  
  test("not found if no such user", async () => {
    try {
      await Message.send("test11", "non-existing-user", "test");
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request error for invalid inputs", async () => {
    try {
      await Message.send("test11", "test22", ""); // no message
      fail();
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });
});

/** delete */
describe("delete", () => {
  test("works", async () => {
    const msgResults = await db.query(`INSERT INTO messages 
      (sent_by, sent_to, text) 
      VALUES 
      ('test11', 'test22', 'someMsg')
      RETURNING *`);
    const message = msgResults.rows[0];
    expect(message).toEqual({
      id: expect.any(Number),
      sent_by: "test11",
      sent_to: "test22",
      text: "someMsg",
      created_at: expect.any(Date),
    });
    await Message.delete(message.id);
    const res = await db.query(`SELECT * FROM messages WHERE id = $1`, [
      message.id,
    ]);
    expect(res.rows.length).toEqual(0);
  });

  test("NotFoundError if messageId does not exist", async () => {
    try {
      await Message.delete(9884848);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

/** getAll */
describe("getAll", () => {
  test("works", async () => {
    const allMessagesResults = await Message.getAll();
    expect(allMessagesResults).toEqual([
      {
        id: 1,
        sent_by: "test11",
        sent_to: "test22",
        text: "admin sending non-admin message",
        created_at: expect.any(Date),
      },
      {
        id: 2,
        sent_by: "test22",
        sent_to: "test33",
        text: "regular user sending message",
        created_at: expect.any(Date),
      },
      {
        id: 3,
        sent_by: "test33",
        sent_to: "test22",
        text: "testMsg",
        created_at: expect.any(Date),
      },
      {
        created_at: expect.any(Date),
        id: 4,
        sent_by: "test22",
        sent_to: "test33",
        text: "something",
      },
    ]);
  });
});
