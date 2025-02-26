var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var cmsRouter = require('./routes/cms');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  const pool  = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
  });

  find_db = 'SHOW DATABASES LIKE "exapp"';
  create_db = 'CREATE DATABASE exapp';
  use_table = 'USE exapp';
  create_table = 'CREATE TABLE cms (id INT AUTO_INCREMENT, title VARCHAR(255) NOT NULL, content VARCHAR(255) NOT NULL, PRIMARY KEY (id));'

  try {
    const [results, fields] = await pool.query(find_db);

    // データベースがなければデータベースとテーブルを作成
    if(!results.length){
      await pool.query(create_db);
      await pool.query(use_table);
      await pool.query(create_table);
    }
    console.log("DBとテーブルの作成が終了しました。")
  } catch (err) {
    console.log(err);
  }
  pool.end()
})();

app.use('/', indexRouter);
app.use('/cms', cmsRouter);


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
  res.render('error');
});

module.exports = app;
