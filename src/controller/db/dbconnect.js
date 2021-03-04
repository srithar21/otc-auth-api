
 
const {Connection, Request} = require("tedious");



 exports.executeSQL = (sql, callback) => {
  const connection = new Connection({
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
  console.log(sql)

  connection.connect((err) => {
    if (err)
      return callback(err, null);

      var jsonArray = [];


    const request = new Request(sql, (err, rowCount, rows,jsonArray) => {
      connection.close();

      if (err)
        return callback(err, null);

      callback(null, {rowCount, rows, jsonArray});
    });

    // request.on('row', (columns) => {
    //   columns.forEach((column) => {
    //     if (column.value === null) {
    //       console.log('NULL');
    //     } else {
    //       console.log(column.value);
    //     }
    //   });
    // });


// Register callback for row event
request.on('row', (columns)=>{
  var rowObject = {};
  columns.forEach((column)=> {
    rowObject[column.metadata.colName] = column.value;
  });

  jsonArray.push(rowObject);
});
// resolve(jsonArray);

    connection.execSql(request);
  });
};


 
