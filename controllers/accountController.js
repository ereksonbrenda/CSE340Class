const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
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
* Deliver Account Management View
************************** */
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null,
  })
}


/* ************************
* Process Registration Week4
************************** */
async function accountRegister(req, res,) {
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
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    console.log("hashedPassword: ", hashedPassword)
  } catch (error) {
    req.flash("notice", "There was an error processing your registration.")
    res.status(500).render("account/register", {
      title:'Registration',
      nav,  
      errors: null,
    })
  }

  const regResult = await accountModel.accountRegister(
    account_firstname,
    account_lastname,
    account_email,
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
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Process login request
* ************************************ */
async function accountLogin(req, res) {
let nav = await utilities.getNav()
const { account_email, account_password } = req.body
const accountData = await accountModel.getAccountByEmail(account_email)
if (!accountData) {
 req.flash("notice", "Please check your credentials and try again.")
 res.status(400).render("account/login", {
  title: "Login",
  nav,
  errors: null,
  account_email,
 })
return
}
try {
 if (await bcrypt.compare(account_password, accountData.account_password)) {
 delete accountData.account_password
 const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
 res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
 return res.redirect("/account/")
 }
 else {
  req.flash("notice", 'Sorry, password failed');
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}
} catch (error) {
 return new Error('Access Forbidden')
}
}


/* ************************
 * deliver edit account view
  * ************************ */
async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav();
  let account = res.locals.accountData;

  const account_id = parseInt(req.params.account_id);
  res.render("account/editAccount", {
    title: "Edit Account Information",
    nav,
    errors: null, 
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_id: account_id
  });
}


/* ****************************************
 * Process updated account information (POST /editaccount)
 * *************************************** */
async function editAccountInfo(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const updateResult = await accountModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id);

  if (updateResult) {
    res.clearCookie("jwt");
    const accountData = await accountModel.getAccountById(account_id);
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });

    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    req.flash("notice", `Congratulations, ${account_firstname} you've successfully updated your account info.`);
    res.status(201).render("account/accountManagement", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })

  } else {
    req.flash("error", "Sorry, the update failed.");
    res.status(501).render("account/editAccount", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 * Process updated account password (POST /editpassword)
 * *************************************** */
async function editAccountPassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;
  let hashedPassword;
  
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/editAccount", {
      title: "Edit Account Password",
      nav,
      errors: null,
    });
    return; 
  }

  const passwordUpdateResult = await accountModel.changeAccountPassword(hashedPassword, account_id);
  const updatedAccount = await accountModel.getAccountById(account_id);

  if (passwordUpdateResult) {
    req.flash("notice", `Congratulations, ${updatedAccount.account_firstname} you've successfully updated your password.`);
    res.status(201).render("account/accountManagement", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname: updatedAccount.account_firstname,
    })

  } else {
    req.flash("error", "Sorry, the password update failed.");
    res.status(501).render("account/editAccount", {
      title: "Edit Account Password",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Logout user
* *************************************** */
async function logoutUser(req, res, next) {
  res.clearCookie('jwt')
  res.redirect("/")
  return
}

/* ****************************************
*  Deliver Employee Management View
* *************************************** */
async function buildEmployeeManagementView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/employee-management", {
    title: "Employee Management",
    nav,
    errors: null,
  });
}


/* ****************************************
  * Deliver Employee List View (GET /employeelist)
  * *************************************** */
async function buildEmployeeListView(req, res, next) {
  let nav = await utilities.getNav();
  let employeeList = await accountModel.getAllEmployees();
  res.render("account/employeeList", {
    title: "Employee List",
    nav,
    errors: null,
    employeeList
  });
}


/* ****************************************
 * Employee List
  * *************************************** */
async function employeeList(req, res, next) {
  let nav = await utilities.getNav();
  let employeeList = await accountModel.getAllEmployees();
  res.render("account/employee-list", {
    title: "Employee List",
    nav,
    errors: null,
    employeeList
  });
}


/* ****************************************
  * Build employee add view (GET /addemployee)
  * *************************************** */
async function buildEmployeeAddView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/addemployee", {
    title: "Add Employee",
    nav,
    errors: null,
  });
}

/* ****************************************
  * Add employee account (POST /addemployee)
  * *************************************** */
async function addEmployee(req, res, next) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_type } = req.body;
  const addResult = await accountModel.addEmployee(account_firstname, account_lastname, account_email, account_type);

  if (addResult) {
    req.flash("notice", `Congratulations, you've successfully added the employee.`);
    res.status(201).render("account/employee-list", {
      title: "Employee List",
      nav,
      errors: null,
    })

  }

  else {
    req.flash("error", "Sorry, the add failed.");
    res.status(501).render("account/employee-management", {
      title: "Employee Management",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
  * Build employee delete view (GET /deleteemployee)
  * *************************************** */
async function buildEmployeeDeleteView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/deleteemployee", {
    title: "Delete Employee",
    nav,
    errors: null,
  });
}


/* ****************************************
 * Delete employee account (POST /deleteemployee)
 * *************************************** */

async function deleteEmployee(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id } = req.body;
  const deleteResult = await accountModel.deleteEmployee(account_id);

  if (deleteResult) {
    req.flash("notice", `Congratulations, you've successfully deleted the employee.`);
    res.status(201).render("account/employeeList", {
      title: "Employee List",
      nav,
      errors: null,
    })

  }

  else {
    req.flash("error", "Sorry, the delete failed.");
    res.status(501).render("account/employee-management", {
      title: "Employee Management",
      nav,
      errors: null,
    })
  }
}



module.exports = { 
buildLogin, 
buildRegister, 
accountRegister, 
accountLogin,
buildAccountManagementView,
buildEditAccount,
editAccountInfo,
editAccountPassword,
logoutUser,
buildEmployeeManagementView,
buildEmployeeListView, employeeList,
buildEmployeeAddView,addEmployee,
buildEmployeeDeleteView,deleteEmployee,
}