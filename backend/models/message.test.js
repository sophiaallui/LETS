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
describe("Message.send(sent_by, data)", () => {
  const data = {
    text: "testing text",
    roomId: 1,
  };
  test("works", async () => {
    const message = await Message.send("test11", data);
    expect(message).toEqual({
      id: expect.any(Number),
      sentBy: "test11",
      text: "testing text",
      createdAt: expect.any(Date),
      roomId: 1,
    });
  });

  test("not found if no such user", async () => {
    try {
      await Message.send("I DONT EXIST LMAO", data);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

/** delete */
describe("Message.delete(messageId)", () => {
  test("works", async () => {
    await Message.delete(2);
    const res = await db.query(`SELECT * FROM messages WHERE id = 2`);
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
describe("Message.getByRoomId(roomId)", () => {
  test("works", async () => {
    const allMessagesResults = await Message.getByRoomId(1);
    expect(allMessagesResults).toEqual([
      {
        id: 3,
        sentBy: "test22",
        text: "I am admin",
        createdAt: expect.any(Date),
        roomId: 1,
      },
      {
        id: 4,
        sentBy: "test33",
        text: "I know I made you",
        createdAt: expect.any(Date),
        roomId: 1,
      },
      {
        id: 5,
        sentBy: "test11",
        text: "This calendar is stupid",
        createdAt: expect.any(Date),
        roomId: 1,
      },
    ]);
  });
});
