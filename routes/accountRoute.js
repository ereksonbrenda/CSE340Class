/* ******************
*account route
******************* */
const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")


/* ************************
* Deliver Login View
************************** */
router.get("/login", accountController.buildLogin);

module.exports = router;