const CalendarEvent = require("./calendarEvent");
const { NotFoundError, BadRequestError } = require("../ExpressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../routes/_testCommon");

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
      radios : "bg-info"
    });
  });

});




