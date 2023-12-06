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
************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", 
    regValidate.loginRules(), 
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount));
    
/* ************************
* Deliver Registration View
************************** */

router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.post("/register",
    regValidate.registationRules(), 
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount));

module.exports = router;