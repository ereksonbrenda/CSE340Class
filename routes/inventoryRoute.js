// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const validate = {}

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildDetailById);
router.get("/add-classification", invController.buildAddClassificationForm);
router.get("/management", utilities.handleErrors(invController.buildManagement));
router.get('/add-vehicle', invController.buildAddVehicleForm);

//router.get("/add-inventory", invController.buildAddInventoryForm);
router.post("/add-classification", invController.addClassification);
router.post("/add-vehicle", invController.addVehicle);

//add new route that works with the new URL in the javascript file
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//add route for editing inventory items
router.get("/edit/:inv-id", utilities.handleErrors(invController.buildInventoryEditForm));
router.post("/update/", utilities.handleErrors(invController.updateInventory))
//add validation to these routes and the add vehicle route classification route.

//router to delete inventory items
 router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView))
 router.post("/delete", utilities.handleErrors(invController.deleteItem))



module.exports = router;