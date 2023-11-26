const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}


/* ************************
* Deliver Management View
************************** */
invCont.buildManagement = async function(req, res, next){
  let nav = await utilities.getNav()
  res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
  })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  if (data.length === 0) {
res.render("./inventory/classification", {
  title: "No vehicles found",
  nav
  })
  }else{

  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    content: data
  })
}
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

/* ***************************
  *  Build add classification form
  * ************************** */
invCont.buildAddClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
  *  Process add classification
  * ************************** */
invCont.addClassification = async function (req, res, next) {
 
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  try {
    const data = await invModel.addClassification(classification_name)
    if (data.length === 0) {
      throw new Error("ControllerError: Unable to add classification")
    } else {
      req.flash("success", `Classification ${classification_name} added`)
      res.status(201).render("./inventory/management", {
        title: "Add Classification",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    req.flash("error", `Sorry, there was an error processing the classification`)
    res.status(500).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
  *  Build add vehicle form
  * ************************** */ 
invCont.buildAddVehicleForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  const data = await invModel.getClassifications()
  res.render("inventory/add-vehicle", {
    title: "Add Vehicle",
    nav,
    classifications: data.rows,
    errors: null,
  })
}

/* ***************************
  *  Process add vehicle
  * ************************** */
invCont.addVehicle = async function (req, res, next) {
  console.log(req.body)
  let nav = await utilities.getNav()
  const getClassifications = await invModel.getClassifications()
  const {classification_id, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_price, inv_description, inv_image, inv_thumbnail} = req.body
  try {
    const data = await invModel.addVehicle(classification_id, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_price, inv_description, inv_image, inv_thumbnail)
    if (data.length === 0) {
      throw new Error("ControllerError: Unable to add vehicle")
    } else {
      req.flash("success", `Vehicle ${inv_make} ${inv_model} added`)
      res.status(201).render("./inventory/management", {
        title: "Management",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    req.flash("error", `Sorry, there was an error processing the vehicle`)
    res.status(500).render("./inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classifications: getClassifications.rows,
      errors: null,
    })
  }
}

/* ***************************
  *  Build add form?
    Build add classification form?
    Build Management view?
    Which one here?
  * ************************** */ 


module.exports = invCont
