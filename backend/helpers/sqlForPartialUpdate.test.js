const { sqlForPartialUpdate, sqlForInsert } = require("./sqlForPartialUpdate");

describe("sqlForPartialUpdate", function () {
  test("works: 1 item", function () {
    const result = sqlForPartialUpdate({ f1: "v1" }, { f1: "f1", fF2: "f2" });
    console.log(result);
    expect(result).toEqual({
      setCols: '"f1"=$1',
      values: ["v1"],
    });
  });

  test("works: 2 items", function () {
    const result = sqlForPartialUpdate(
      { f1: "v1", jsF2: "v2" },
      { jsF2: "f2" }
    );
    console.log(result);
    expect(result).toEqual({
      setCols: '"f1"=$1, "f2"=$2',
      values: ["v1", "v2"],
    });
  });
});

describe("sqlForInsert", () => {
  test("works", () => {
    const res = sqlForInsert(
      {
        createdBy: "Jae Cho",
        heightInInches: "98498",
        weightInPounds: "sdf",
      },
      {
        createdBy: "created_by",
        heightInInches: "height_in_inches",
        weightInPounds: "weight_in_pounds",
        armsInInches: "arms_in_inches",
        legsInInches: "legs_in_inches",
        waistInInches: "waist_in_inches",
      },
      "users_measurements"
    );
    console.log(res);
  });
});
