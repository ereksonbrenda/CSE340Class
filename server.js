/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const bodyParser = require("body-parser")
const static = require("./routes/static")
const baseController=require("./controllers/baseController")
const utilities = require("./utilities")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")

/* ***********************
 * Middleware
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


 //Express Messages Middleware
 app.use(require('connect-flash')())
 app.use(function(req, res, next){
    res.locals.messages = require('express-messages')(req, res)
    next()
 })

//Body Parser Middleware
app.use(bodyParser.json())
//for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

/* ***********************
 * view Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/
app.use(static)
//Index Route
app.get("/",utilities.handleErrors(baseController.buildHome))
//inventory route
//Is this the route I use for the add inventory form?
//Is this how to add handle.Errors with the require?
app.use("/inventory",require("./routes/inventoryRoute"))

//account route
app.use("/account",utilities.handleErrors(require("./routes/accountRoute")))  

//broken route

app.get('/broken', (req, res, next) => {
    // Create an error object
const err = new Error('This is a simulated error');
  
  // Pass the error to the next middleware
  next(err);
});
//File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  let systemErrorMessage = 'OOps there is an error with the system! Please try again later.';
  let defaultErrorMessage = 'Oh no! There was a crash. Maybe try a different route?';
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 500){ message = err.message} else {message = systemErrorMessage}
  if(err.status == 404){ message = err.message} else {message = defaultErrorMessage}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    //message: err.message,
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



