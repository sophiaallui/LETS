const jwt = require("jsonwebtoken");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
} = require("./auth");

const { SECRET } = require("../config");
const testJWT = jwt.sign({ username: "test", isAdmin: false }, SECRET);
const badJWT = jwt.sign({ username: "test", isAdmin: false }, "bad");

describe("authenticatJWT", () => {
  test("works: via header", () => {
    expect.assertions(2);
    const req = {
      headers : {
        authorization : `Bearer ${testJWT}`
      }
    };
    const res = { locals : {} };
    const next = function(err) {
      expect(err).toBeFalsy();
    }
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user : {
        iat : expect.any(Number),
        username : "test",
        isAdmin : false
      }
    });
  });

  
});
