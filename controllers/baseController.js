const utilities = require("../utilities/")
const baseController = {}

/* ************************
 * Build Home View with MVC
 ************************** */
baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  //req.flash("notice", "This is a flash message.") it was just for testing
  res.render("index", {title: "Home", nav})
}

module.exports = baseController;