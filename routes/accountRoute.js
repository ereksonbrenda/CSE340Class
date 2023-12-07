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
    regValidate.loginRules(), 
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin));
    
/* ************************
* Deliver Registration View
************************** */

router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.post("/register",
    regValidate.registationRules(), 
    regValidate.checkRegData,
    utilities.handleErrors(accountController.accountRegister));


/* ************************
 * Deliver Account Management View
    ************************** */
   router.get("/", utilities.checkLogin,
   utilities.handleErrors(accountController.buildAccountManagementView))


//router for building account update login
router.get("/edit/:account_id", 
utilities.handleErrors(accountController.buildAccountUpdateView));

//router for Updating account
// Process the updated account information
router.post("/accountupdate",
    regValidate.updateAccountRules(),
    regValidate.checkEditAccountData,
    utilities.handleErrors(accountController.editAccountInfo)
  );
  
  // Process the account password change
  router.post("/changepassword",
    regValidate.changePasswordRules(),
    regValidate.checkEditAccountData,
    utilities.handleErrors(accountController.editAccountPassword)
  );


module.exports = router;