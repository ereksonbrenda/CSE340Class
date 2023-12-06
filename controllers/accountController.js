const bycrypt = require("bcryptjs")
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
//const accountController = {}



/* ************************
* Deliver Login View
************************** */
async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ************************
* Process Registration Week4
************************** */
async function registerAccount(req, res,) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password, 

  } = req.body;

  //hash the password
  let hashedPassword
  try {
    hashedPassword = await bycrypt.hash(account_password, 10)
  } catch (error) {
    regFlash("notice", "There was an error processing your registration.")
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ************************
* Process Login
************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_email,
    account_password
  } = req.body;

  const loginResult = await accountModel.loginAccount(
    account_email,
    account_password,
  );

  if (loginResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re logged in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("account/login", {
      title: "Login",
      nav,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount }