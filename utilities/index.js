const invModel = require("../models/inv-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inv of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ************************
 * Build classification dropdown
 ************************** */
Util.buildClassificationList = async function (selectedOption) {
  let data = await invModel.getClassifications();
  let options = `<option value="">Choose a classification</option>`;
  data.rows.forEach((row) => {
    options += `<option value="${row.classification_id}"
      ${row.classification_id === Number(selectedOption) ? "selected" : ""}>
      ${row.classification_name}
      </option>`;
  });
  return options;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {};

/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildDetailPage = async function (data) {};

/* **************************************
 * Build the management view HTML
 * ************************************ */
Util.buildManagementPage = async function (data) {};

/* **************************************
 * Build the add classification form HTML
 * ************************************ */
Util.buildAddClassificationForm = async function (data) {};

/* **************************************
 * Build the add vehicle form HTML
 * ************************************ */
Util.buildAddVehicleForm = async function (data) {};

/* **************************************
 * Build the AccountManagement view HTML
 * ************************************ */
Util.buildAccountManagementPage = async function (data) {};

/* **************************************
 * Build the employee management view HTML
 * ************************************ */
Util.buildEmployeeManagementPage = async function (data) {};

/* **************************************
 * Build the employee list view HTML
 * ************************************ */
Util.buildEmployeeListPage = async function (data) {};

/* **************************************
 * Build the employee add form HTML
 * ************************************ */
Util.buildEmployeeAddForm = async function (data) {};

/* **************************************
 * Build the employee delete form HTML
 * ************************************ */
Util.buildEmployeeDeleteForm = async function (data) {};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware for checking JWT token
 * login activity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    console.log("JWT Token Found");
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 * Check Login
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check user authorization, block unauthorized users
 * ************************************ */
Util.checkAccountType = async (req, res, next) => {
  // auth : 0
  let auth = 0;
  // logged in ? next : 0
  if (res.locals.loggedin) {
    const account = res.locals.accountData;
    account.account_type == "Admin" || account.account_type == "Employee"
      ? (auth = 1)
      : (auth = 0);
  }
  if (!auth) {
    req.flash("notice", "Please log in");
    res.redirect("/account/login");
    return;
  } else {
    next();
  }
};

module.exports = Util;
