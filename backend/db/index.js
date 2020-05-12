const mysql = require('mysql');

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'taskhack'
});

connection.connect((err)=> {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else{
    console.log('db connected successfully');
  }
});

module.exports = connection;