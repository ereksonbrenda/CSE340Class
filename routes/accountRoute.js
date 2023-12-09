/* ******************
* Required Packages
******************* */
const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

/* ************************
* Deliver Login View
* Stickyness activity
************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login",
    //regValidate.loginRules(), 
    //regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin));

    
/* ************************
* Deliver Registration View
************************** */

router.get("/register", accountController.buildRegister);

router.post ("/register",
    regValidate.registationRules(), 
    regValidate.checkRegData,
    accountController.accountRegister);


/* ************************
 * Deliver Account Management View
    ************************** */
router.get("/", utilities.checkLogin,
utilities.handleErrors(accountController.buildAccountManagementView))


//router for building account update login
router.get("/edit/:account_id", 
utilities.handleErrors(accountController.buildEditAccount));

//router for Updating account
// Process the updated account information
router.post("/editAccount",
    //regValidate.updateAccountRules(),
    //regValidate.checkEditAccountData,
    utilities.handleErrors(accountController.editAccountInfo)
  );
  
  // Process the account password change
  router.post("/changepassword",
    regValidate.changePasswordRules(),
    regValidate.checkEditAccountData,
    utilities.handleErrors(accountController.editAccountPassword)
  );

/* ************************
  * Deliver Employee Management View
  ************************** */
 //router for building employee management view

 /* ************************

router.get("/employee", utilities.checkLogin,
utilities.checkAdmin,
utilities.handleErrors(accountController.buildEmployeeManagementView));

//router for building employee list
router.get("/employeelist",
utilities.checkLogin,
utilities.checkAdmin,
utilities.handleErrors( accountController.buildEmployeeListView));

//router for adding employee
router.post("/employeeadd",
utilities.checkLogin,
utilities.checkAdmin,
utilities.handleErrors(accountController.addEmployee));

//router for deleting employee
router.post("/employeedelete",
utilities.checkLogin,
utilities.checkAdmin,
utilities.handleErrors(accountController.deleteEmployee));


/******************* */
module.exports = router;