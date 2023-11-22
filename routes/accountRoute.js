// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

/* ************************
* Deliver Login View
************************** */

router.get("/account/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;