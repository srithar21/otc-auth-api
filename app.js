var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./src/routes/users');
var accountRoutes = require('./src/controller/accounts/routes')

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
 



app.get('/api/account/create',(req,res,next)=>{
  request(process.env.QA_HOST_IDENTITY_PLATFORM+'/v1/accounts:signUp?key='+process.env.QA_IDENTITY_PLATFORM_API_KEY,
   function (error, response, body) {
       res.send(body)
  });  
});

var cors = require('cors');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// use it before all route definitions
app.use(cors({origin: '*'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

app.use('/api/account', accountRoutes);

// accountRoutes.forEach((route, index) => {
//     app.route(route)
// })

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
