/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
  *************************/


const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
  require("dotenv").config()
const baseController=require("./controllers/baseController")
const utilities = require("./utilities")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const app = express()


//const static = require("./routes/static")
//const invRoute = require("./routes/invRoute")
//const accountRoute = require("./routes/accountRoute")

/* ***********************
 * Middleware
 * Between the request and the response
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')());

app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//Body Parser Middleware
app.use(bodyParser.json())
//for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))// for parsing application/x-www-form-urlencoded

//Cookie Parser Middleware week5
app.use(cookieParser())
//Login Processing Middleware
app.use(utilities.checkJWTToken)


/* ***********************
 * view Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));
//build base route
app.get("/", baseController.buildHome);
//inv routes
app.use("/inv", require("./routes/invRoute"));
//account routes
app.use("/account", require("./routes/accountRoute"));

//app.use("/error", errorRoute);

//broken route
app.get('/broken', (req, res, next) => {
    // Create an error object
const err = new Error('This is a simulated error');
  
  // Pass the error to the next middleware
  next(err);
});

//File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'well, sorry, we appear to have lost that page.'});
});

/* ***********************
* Express Error Handler
* Place after all other middleware
* Unit 3 error handling.
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There must have been a terrible crash. Maybe try a different route?'}
  if(err.status == 500){ message = err.message} else {message = 'Oh Shoot, you hit a pothole, let me call a trucker, oh yeah, I can\t, I am a pothole!'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})