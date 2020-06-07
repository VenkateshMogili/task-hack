const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const jwt= require('jsonwebtoken');
const port = process.env.PORT || 8080;

/*express config*/
const app = express();
app.use(cors({origin:'*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/*routes*/
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');
app.use('/api/users/', usersRouter);
app.use('/api/tasks/', tasksRouter);

/*server*/
app.listen(port,() => {
  console.log("Server is running on port: "+port);
});

