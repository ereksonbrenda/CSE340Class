const invModel = require("../models/inv-model")
const utilities = require("../utilities/")
const invCont = {}


/* ************************
* Deliver Management View
************************** */
invCont.buildManagement = async function(req, res, next){
  let nav = await utilities.getNav()
  const classificationDropDown = await utilities.buildClassificationList()
  res.render("inv/management", {
      title: "Inv Management",
      nav,
      errors: null,
      classificationDropDown,
  })
}

/* ***************************
 *  Build inv by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = req.params.classificationId
  const data = await invModel.getInvByClassificationId(classification_id)
  if (data.length === 0) {
res.render("./inv/classification", {
  title: "No vehicles found",
  nav
  })
  }else{

  const className = data[0].classification_name
  res.render("./inv/classification", {
    title: className + " vehicles",
    nav,
    content: data
  })
}
}

/* ***************************
  *  Build inv detail view
  * ************************** */
invCont.buildDetailById = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = req.params.invId
  const data = await invModel.getInvDetailById(inv_id)
  if (data.length === 0) {
    throw new Error("ControllerError: Unable to find inv item")
  }else{
    vehicleName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
    res.render("./inv/detail", {
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
  res.render("inv/add-classification", {
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
      res.status(201).render("./inv/management", {
        title: "Add Classification",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    req.flash("error", `Sorry, there was an error processing the classification`)
    res.status(500).render("./inv/add-classification", {
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
  const classificationDropDown = await utilities.buildClassificationList()
  res.render("inv/add-vehicle", {
    title: "Add Vehicle",
    nav,
    classificationDropDown,
    errors: null,
  })
}


/* ***************************
  *  Process add vehicle
  * ************************** */
invCont.addVehicle = async function (req, res, next) {
  console.log(req.body)
  let nav = await utilities.getNav()
      req.flash("success", `Vehicle ${inv_make} ${inv_model} added`)
      res.status(201).render("./inv/management", {
        title: "Management",
        nav,
        errors: null,
        
      })
    }

/* ***************************
  *  Return inv by classification as JSON
  * ************************** */
invCont.getInvJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInvByClassificationId(classification_id)
  if (invData[0].inv_id){
    return res.json(invData)
  } else{
    next(new Error("No data returned"))
  }
}

/* ***************************
  *  Build inv edit form
  * ************************** */
invCont.buildInvEditForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const classificationDropDown = await utilities.buildClassificationList()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inv/edit-vehicle", {
      title: "Edit" + itemName,
      nav,
      classificationDropDown: classificationDropDown,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    })
  }

  /* ***************************
  *  Update vehicle data
  * ************************** */
invCont.updateInv = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id,inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id,
   } = req.body
   const updateResult = await invModel.updateInv(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
  
   if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", 'The ${itemName} was successfully updated.')
    res.redirect("/inv/")

  } else {
    const classificationDropDown = await utilities.buildClassificationList()
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    req.flash("error", "There was an error updating the ${itemName}.")
    res.status(501).render("./inv/edit-vehicle", {
      title: "Edit" + itemName,
      nav,
      classificationDropDown: classificationDropDown,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    })
  }
}

 /* ***************************
 *  Build the Delete Confirmation View WEEK 5
 * ************************** */
invCont.deleteInvView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInvDetailById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
// Render the delete confirmation view
    res.render("./inv/delete-confirm", {
      title: "Delete Confirmation: " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    console.error("Error in deleteInvView:", error)
    res.status(500).send("Internal Server Error")
  }
}

/* ***************************
 *  Process Delete Inv View with Data WEEK 5
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    const deleteResult = await invModel.deleteInv(inv_id);
    console.log("check the delete", deleteResult)
    if (deleteResult) {
      req.flash("notice", "The deletion was successful.")
      res.status(201).redirect("./" )
    } else {
      req.flash("error", "Vehicle deletion failed.")
      res.status(501).redirect("./inv/delete-confirm")
    }
  } catch (error) {
    console.error('Error in processDeleteItem:', error)
    res.status(500).send("Internal Server Error")
  }
} 

  


/* ***************************
  *  Build add form?
    Build add classification form?
    Build Management view?
    Which one here?
  * ************************** */ 


module.exports = invCont