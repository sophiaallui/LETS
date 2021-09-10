const jwt = require("jsonwebtoken");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
} = require("./auth");

const { SECRET } = require("../config");
const { UnauthorizedError } = require("../ExpressError");
const testJWT = jwt.sign({ username: "test", isAdmin: false }, SECRET);
const badJWT = jwt.sign({ username: "test", isAdmin: false }, "bad");

describe("authenticatJWT", () => {
  test("works: via header", () => {
    expect.assertions(2);
    const req = {
      headers: {
        authorization: `Bearer ${testJWT}`,
      },
    };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      },
    });
  });

  test("works: no header", () => {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", () => {
    expect.assertions(2);
    const req = { headers: { authorization: `Bearer ${badJWT}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});

describe("ensureLoggedIn", () => {
  test("works", () => {
    expect.assertions(1);
    const req = {};
    const res = {
      locals: {
        user: {
          username: "test",
          is_admin: false,
        },
      },
    };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", () => {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = (err) => {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});

describe("ensureAdmin", () => {
  test("works", () => {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", isAdmin: true } } };
    const next = (e) => {
      expect(e).toBeFalsy();
    };
    ensureAdmin(req, res, next);
  });

  test("unauth if not admin", () => {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", isAdmin: false } } };
    const next = (e) => {
      expect(e instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });

  test("unauth if anon", () => {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = (e) => {
      expect(e instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdmin(req, res, next);
  });
});

describe("ensureCorrectUserOrAdmin", () => {
  test("works: admin", () => {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: { user: { username: "test", isAdmin: true } } };
    const next = (err) => {
      expect(err).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("works: same user", () => {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: { user: { username: "test", isAdmin: false } } };
    const next = (e) => {
      expect(e).toBeFalsy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("unauth: mismatch", () => {
    expect.assertions(1);
    const req = { params: { username: "some-other-shit" } };
    const res = { locals: { user: { username: "test", isAdmin: false } } };
    const next = (e) => {
      expect(e instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next);
  });

  test("unauth: anons", () => {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: {} };
    const next = (e) => {
      expect(e instanceof UnauthorizedError).toBeTruthy();
    };
    ensureCorrectUserOrAdmin(req, res, next)
  });
});
