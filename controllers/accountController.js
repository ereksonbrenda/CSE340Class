/* *******************
    *  Account Controller
    *  *******************
    * This controller is responsible for handling all the requests that are related to the account.                                             
    * *******************/
//login view 

const utilities = require('../utilities')

/* ************************
* Deliver Login View
************************** */           

async function buildLogin(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {title: "Login", nav})

}

module.exports = {
    buildLogin
}