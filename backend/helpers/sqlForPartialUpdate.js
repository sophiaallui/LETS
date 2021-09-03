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

module.exports = { sqlForPartialUpdate };