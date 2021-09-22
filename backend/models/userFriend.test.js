const UserFriend = require("./userFriend");
const { 
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("../routes/_testCommon");
const { NotFoundError, BadRequestError } = require("../ExpressError");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("UserFriends.getAllFrom(username)", () => {
  test("works: gets all confirmed friends about username", async () => {
    const res = await UserFriend.getAllFrom('test11');
    console.log(res)
  })
})