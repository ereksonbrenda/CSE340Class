const utilities = require("../utilities/")
const accountController = {}
/* ************************
* Deliver Login View
************************** */
accountController.buildLogin = async function(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

module.exports = accountController

