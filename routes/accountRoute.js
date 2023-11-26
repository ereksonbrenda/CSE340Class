/* ******************
*account route
******************* */
const regValidate = require('../utilities/account-validation')

const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")


/* ************************
* Deliver Login View
************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
//router.post("/register", regValidate.registrationRules(),
//regValidate.checkRegData,
utilities.handleErrors(accountController.registerAccount)

// Process the login attempt
router.post("/login", utilities.handleErrors(accountController.loginAccount));

// Process the registration attempt
router.post("/register", utilities.handleErrors(accountController.registerAccount));

module.exports = router;