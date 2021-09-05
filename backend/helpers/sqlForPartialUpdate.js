const {BadRequestError} = require("../ExpressError")
/**
 * Helper function for making selective update queries.
 * The calling function can use it to make SET clause of an SQL UPDATE statement.
 * @param dataToUpdate {Object} { field1 : newVal, field2 : newVal, ... }
 * @param jsToSql {Object} maps js-style data fields to database column names 
 *    example.) { firstName : "first_name", lastName : "last_name" }
 * 
 * @returns {Object} {sqlSetCols, dataToUpdate}
 * @example {firstName : 'Jae', lastName : 'Cho'} => {
 *   setCols : '"first_name"=$1 "last_name"=$2',
 *   values : ['Jae', 'Cho']
 * }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if(keys.length === 0) throw new BadRequestError("No data");

  // {firstName : 'Sophia', lastName : 'Lui'} => ['"first_name"=$1', '"last_name"=$2']
  const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`);
  return {
    setCols : cols.join(", "),
    values : Object.values(dataToUpdate)
  }
};

const userMeasurementsJsToSql = {
  createdBy : 'created_by',
  heightInInches : 'height_in_inches',
  weightInPounds : 'weight_in_pounds',
  armsInInches : 'arms_in_inches',
  legsInInches : 'legs_in_inches',
  waistInInches : 'waist_in_inches'
}

function sqlForInsert(dataToInsert, jsToSql, tableName) {
  let baseQuery = `INSERT INTO ${tableName} `
  const keys = Object.keys(dataToInsert);
  if(keys.length === 0) throw new BadRequestError("No data");
  const colsArray = keys.map((colName, idx) => `${jsToSql[colName] || colName}`);
  const cols = colsArray.join(", ");

  baseQuery = baseQuery + "(" + cols + ") VALUES "
  const valuesArray = Object.values(dataToInsert).map((ele, idx) => `$${idx + 1}`);
  const valuesQueryString = valuesArray.join(", ");

  const returningArray = keys.map((colName) => `${jsToSql[colName]} || ${colName} AS ${colName}`);
  const 
  baseQuery = baseQuery + "(" + valuesQueryString + ")"
  return {
    baseQuery,
    values : Object.values(dataToInsert)
  }
}

module.exports = { sqlForPartialUpdate, sqlForInsert, userMeasurementsJsToSql};