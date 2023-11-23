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
router.post("/register", regValidate.registrationRules(),
regValidate.checkRegData,
utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

// Process the registration attempt
router.post(
    "/register",
    (req, res) => {
      res.status(200).send('registration process')
    }
  )

module.exports = router;