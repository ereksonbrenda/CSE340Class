// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")
const validate = {}

// Route to build inv by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildDetailById);
router.get("/add-classification", invController.buildAddClassificationForm);
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get('/add-vehicle', invController.buildAddVehicleForm);

//router.get("/add-inv", invController.buildAddInvForm);
router.post("/add-classification", invController.addClassification);
router.post("/add-vehicle", invController.addVehicle);

//add new route that works with the new URL in the javascript file
router.get("/getInv/:classification_id", utilities.handleErrors(invController.getInvJSON));

//add route for editing inv items
router.get("/edit/:inv-id", utilities.handleErrors(invController.buildInvEditForm));
router.post("/update/", utilities.handleErrors(invController.updateInv))
//add validation to these routes and the add vehicle route classification route.

//router to delete inv items
 router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInvView))
 router.post("/delete", utilities.handleErrors(invController.deleteItem))



module.exports = router;