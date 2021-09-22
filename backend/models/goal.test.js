const Goal = require("./goal");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../routes/_testCommon");
const { NotFoundError, BadRequestError } = require("../ExpressError");
const db = require("../db");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Goal.getAll()", () => {
  test("works", async () => {
    const res = await Goal.getAll();
    expect(res).toEqual([
      {
        id: 1,
        createdBy: 'test11',
        content: 'testing content',
        dueDate: expect.any(Date),
        isComplete: false
      },
      {
        id: 2,
        createdBy: 'test11',
        content: 'testing content2',
        dueDate: expect.any(Date),
        isComplete: false
      }
    ])
  });
});

describe("Goal.getByUsername(username)", () => {
  test("works: returns goals for that username", async () => {
    const res = await Goal.getByUsername("test11");
    expect(res).toEqual([
      {
        id: 1,
        createdBy: 'test11',
        content: 'testing content',
        dueDate: expect.any(Date),
        isComplete: false
      },
      {
        id: 2,
        createdBy: 'test11',
        content: 'testing content2',
        dueDate: expect.any(Date),
        isComplete: false
      }
    ])
  });
  test("Not found error if username does not exist", async () => {
    try {
      await Goal.getByUsername("I DONT EXIST");
      fail();
    } catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });

});

describe("Goal.create(username, data)", () => {
  test("works", async () => {
    const data = {
      content : "testing content",
      dueDate : new Date(),
      isComplete : true
    };
    const res = await Goal.create("test33", data);
    expect(res).toEqual({
      id : expect.any(Number),
      createdBy : "test33",
      content : data.content,
      dueDate : expect.any(Date),
      isComplete : true
    })
  });
  test("Not found error if username does not exist", async () => {
    try {
      await Goal.create("I DONT EXIST", { content : "something" });
      fail();
    } catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("Goal.update(id, data)", () => {
  test("works: ", async () => {
    const res = await Goal.update(1, { content : "new CONTENT XD"});
    expect(res).toEqual({
      id : 1,
      createdBy : 'test11',
      content : "new CONTENT XD",
      dueDate : expect.any(Date),
      isComplete : false
    })
  });
  test("BadRequestError for invalid update", async () => {
    try {
      await Goal.update(1, {});
      fail();
    }
    catch(e) {
      expect(e instanceof BadRequestError).toBeTruthy()
    }  
  });
});

describe("Goal.delete(id)", () => {
  test("works", async () => {
    await Goal.delete(1);
    const checkCount = await db.query('SELECT * FROM goals WHERE id = 1');
    expect(checkCount.rows.length).toEqual(0);
  });
  test("NotFoundError for non existant id", async () => {
    try {
      await Goal.delete(99999999);
      fail();
    } catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  })
})