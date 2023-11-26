// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildDetailById);
router.get("/add-classification", invController.buildAddClassificationForm);
router.get("/management", utilities.handleErrors(invController.buildManagement));
router.get('/add-vehicle', invController.buildAddVehicleForm);

//router.get("/add-inventory", invController.buildAddInventoryForm);
router.post("/add-classification", invController.addClassification);
router.post("/add-vehicle", invController.addVehicle);

//Do I need a new route for adding inventory and classification?
//router.get("/add", invController.buildAddForm);

module.exports = router;