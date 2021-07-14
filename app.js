var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
var { swaggerUI, swaggerDocs } = require('./config/swagger-config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

require('dotenv').config();

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //res.header('Access-Control-Allow-Methods', ' PUT, POST, GET, DELETE, OPTIONS');
  next();
});
app.use(cors(corsOptions));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({ limits: { fileSize: 25 * 1024 * 1024 }, }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/teams', (req, res) => { });
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/*', indexRouter);

console.log(process.env.HOSTNAME);

module.exports = app;
