var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./src/routes/users');
var accountRoutes = require('./src/controller/accounts/routes')
const session = require('express-session')


var app = express();



app.use(function(req, res, next) {
  console.log("Express session response ouside cors")

  let allowedOrigins = ["http://localhost:3000", "https://otc-web-qa.azurewebsites.net"]
  // let origin = req.headers.origin;
  // console.log(origin)
  // if (allowedOrigins.includes(origin)) {
  //   console.log("Express session response inside cors")
  //     res.header("Access-Control-Allow-Origin", allowedOrigins); // restrict it to the required domain
  // }
  res.header("Access-Control-Allow-Origin", allowedOrigins);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Credentials", "true");

  res.header("withCredentials", "true");
  next();
});

var cors = require('cors');

// use it before all route definitions
app.use(cors({origin: '*'}));

// app.use(session({
//   'secret': process.env.SECRET,
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     secure: true
//   }
// }))

var MemoryStore =session.MemoryStore;


app.use(session({
  name : 'app.sid',
  secret: process.env.SECRET,
  resave: true,
  store: new MemoryStore(),
  saveUninitialized: true
}));
 



app.get('/api/account/create',(req,res,next)=>{
  request(process.env.QA_HOST_IDENTITY_PLATFORM+'/v1/accounts:signUp?key='+process.env.QA_IDENTITY_PLATFORM_API_KEY,
   function (error, response, body) {
       res.send(body)
  });  
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());




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
