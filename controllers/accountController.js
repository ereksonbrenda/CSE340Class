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
        errors: null,
    })
}

/* ************************
* Deliver Registration View
************************** */
accountController.buildRegister = async function(req, res,next){
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}


module.exports = accountController;

