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

/* ************************
* Deliver Registration View
************************** */
accountController.buildRegistration = async function(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/registration", {
        title: "Registration",
        nav,
    })
}

module.exports = accountController;

