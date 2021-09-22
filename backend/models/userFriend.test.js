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
    expect(res).toEqual([
      {
        user_from: 'test11',
        user_to: 'test3',
        request_time: expect.any(Date),
        confirmed: 1
      },
      {
        user_from: 'test11',
        user_to: 'test33',
        request_time: expect.any(Date),
        confirmed: 1
      }
    ])
  })
});

describe("UserFriends.getAllPending(username)", () => {
  test("works: gets all friend requests that are pending username's confirmation", async () => {
    const res = await UserFriend.getAllPending('test22');
    expect(res).toEqual([
      {
        user_from: 'test11',
        user_to: 'test22',
        request_time: expect.any(Date),
        confirmed: 0
      },
      {
        user_from: 'test33',
        user_to: 'test22',
        request_time: expect.any(Date),
        confirmed: 0
      }
    ])
  })
});

describe("UserFriends.sendFriendRequest(userFrom, userTo)", () => {
  test("works:", async () => {
    const res = await UserFriend.sendFriendRequest("test1Admin", "test2");
    expect(res).toEqual({
      userFrom: 'test1Admin',
      userTo: 'test2',
      requestTime: expect.any(Date),
      confirmed: 0
    });
  })
  test("works: if the same user just sends a friend request as well", async () => {
    const res = await UserFriend.sendFriendRequest("test1Admin", "test2");
    expect(res).toEqual({
      userFrom: 'test1Admin',
      userTo: 'test2',
      requestTime: expect.any(Date),
      confirmed: 0
    })
    const res2 = await UserFriend.sendFriendRequest("test2", "test1Admin");
    expect(res2).toEqual({
      userFrom: 'test1Admin',
      userTo: 'test2',
      requestTime: expect.any(Date),
      confirmed: 1
    })
  });
  test("not found error if userFrom or userTo not found", async () => {
    try {
      await UserFriend.sendFriendRequest("I dont exist", "test33");
      fail();
    } catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  })
});

describe("UserFriends.confirmFriendRequest(userFrom, userTo)", () => {
  test("works", async () => {
    await UserFriend.sendFriendRequest("test1Admin", "test33");
    const res = await UserFriend.confirmFriendRequest("test1Admin", "test33");
    expect(res).toEqual({
      userFrom: 'test1Admin',
      userTo: 'test33',
      requestTime: expect.any(Date),
      confirmed: 1
    })
  });
  test("not found error if userFrom or userTo not found", async () => {
    try {
      await UserFriend.confirmFriendRequest("I dont exist", "test33");
      fail();
    } catch(e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  })
})