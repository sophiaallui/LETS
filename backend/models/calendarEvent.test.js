const CalendarEvent = require("./calendarEvent");
const { NotFoundError, BadRequestError } = require("../ExpressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../routes/_testCommon");
const db = require("../db");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("CalendarEvent.create(username, data)", () => {
  test("works:", async () => {
    const res = await CalendarEvent.create("test22", {
      eventTitle : "testing event title",
      eventDescription : "testttt",
      startDate : "2021/9/25",
      endDate : "2021/9/26",
      radios : "bg-info"
    });
    expect(res).toEqual({
      id : expect.any(Number),
      eventTitle : "testing event title",      
      eventDescription : "testttt",
      startDate : expect.any(Date),
      endDate : expect.any(Date),
      className : "bg-info"
    });
  });

  test("NotFoundError if username not exists", async () => {
    try {
      await CalendarEvent.create("I dont exist", {
        eventTitle : "testing event title",
        eventDescription : "testttt",
        startDate : "2021/9/25",
        endDate : "2021/9/26",
        radios : "bg-info"
      })
    } 
    catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  })
});

describe("CalendarEvent.getAll(username)", () => {
  test("works:", async () => {
    const res = await CalendarEvent.getAll("test11");
    expect(res.length).toEqual(1);
    expect(res).toEqual([
      {
        id: 1,
        eventTitle: 'test11s title',
        eventDescription: null,
        startDate: new Date('2021-10-31T07:00:00.000Z'),
        endDate: new Date('2021-11-01T07:00:00.000Z'),
        className: 'bg-info'
      }
    ]);
    const res2 = await CalendarEvent.getAll("test22");
    expect(res2.length).toEqual(1);
    expect(res2).toEqual([
      {
        id : 2,
        eventTitle : 'test22s title',
        eventDescription: null,
        startDate: new Date('2021-10-31T07:00:00.000Z'),
        endDate: new Date('2021-11-01T07:00:00.000Z'),
        className: 'bg-danger'
      }
    ])
  })
})

describe("CalendarEvent.getById(calendarEventID)", () => {
  test("works:", async () => {
    const res = await CalendarEvent.getById(1);
    expect(res).toEqual({
      id: 1,
      eventTitle: 'test11s title',
      eventDescription: null,
      startDate: new Date('2021-10-31T07:00:00.000Z'),
      endDate: new Date('2021-11-01T07:00:00.000Z'),
      className: 'bg-info'
    })
  });

  test("NotFoundError if id doesn't exist", async () => {
    try {
      await CalendarEvent.getById(984948497);
      fail();
    }
    catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy()
    }
  })
})

describe("CalendarEvent.deleteById(id)", () => {
  test("works:", async () => {
    const res = await CalendarEvent.deleteById(1);
    const checkIfThere = await db.query(`SELECT * FROM calendar_event WHERE id = 1`);
    expect(checkIfThere.rows.length).toBe(0)
  });
  test("NotFoundError if id does not exist", async () => {
    try {
      await CalendarEvent.deleteById(987897);
      fail();
    } catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  })
})


