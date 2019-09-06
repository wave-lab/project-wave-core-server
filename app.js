var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var helmet = require('helmet');

var cookieParser = require('cookie-parser');
var logger = require('morgan');

var config = require('./src/config/secretKey');
var hash = require('./src/config/hashKey');

var routes = require('./src/app/routes');

//mongodb 불러오기
var mongoose = require('./src/config/mongoose.js');
//db 사용
mongoose();

var app = express();

//cors
const cors = require('cors');
app.use(cors());
app.use(helmet())

//jwt 토큰 키
app.set('jwt-secret', config.key);
//해쉬 키
app.set('hash-secret', hash.key);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
