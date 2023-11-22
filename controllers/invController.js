const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  //const grid = await utilities.buildClassificationGrid(data)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    content: data
  })
}

/* ***************************
  *  Build inventory detail view
  * ************************** */
invCont.buildDetailById = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryDetailById(inventory_id)
  if (data.length === 0) {
    throw new Error("ControllerError: Unable to find inventory item")
  }else{
    vehicleName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
    res.render("./inventory/detail", {
      nav,
      title: vehicleName,
      vehicle: data[0],
    })
  }
}

module.exports = invCont
