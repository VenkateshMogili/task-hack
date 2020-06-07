const mysql = require('mysql');

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',//database username
  password:'root',//database password
  database:'taskhack'//database name
});

connection.connect((err)=> {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else{
    console.log('db connected successfully');
  }
});

module.exports = connection;