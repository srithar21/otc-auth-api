
 
const {Connection, Request} = require("tedious");

exports.executeSQL = (sql, callback) => {
console.log(sql)
  let connection = new Connection({
    "authentication": {
      "options": {
        userName: "admin-qa-customer", 
        password: "niQD}a)QK:51"
      },
      "type": "default"
    },
  server: "otc-customer-qa-server.database.windows.net",
  "options": {
      "validateBulkLoadParameters": false,
      "rowCollectionOnRequestCompletion": true,
      "database": "otc-customer-qa",
      "encrypt": true
    }
  });

  connection.connect((err) => {
    if (err)
      return callback(err, null);

    const request = new Request(sql, (err, rowCount, rows) => {
      connection.close();

      if (err)
        return callback(err, null);

      callback(null, {rowCount, rows});
    });

    connection.execSql(request);
  });
};

// executeSQL("SELECT * FROM users", (err, data) => {
//   if (err)
//     console.error(err);

//   console.log(data.rowCount);
// });

//or

// executeSQL("SELECT * FROM users", (err, {rowCount, rows}) => {
//   if (err)
//     console.error(err);

//   console.log(rowCount);
// });
