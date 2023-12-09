const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inv-model")
const validate = {}

/*  **********************************
 *  Inv Data Validation Rules
* ********************************* */

validate.vehicleRules = () => {

    return [
        // classification is required and must be string
        body("classification_id")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification."), // on error this message is sent.

        // make is required and must be string
        body("inv_make")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a make."), // on error this message is sent.
    
        // model is required and cannot already exist in the DB
        body("inv_model")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a model."),
        
        // year is required and must be string
        body("inv_year")
        .trim()
        .isLength({ min: 4 })
        .withMessage("Please provide a year."), // on error this message is sent.
    
        // price is required and must be strong password
        body("inv_price")
        .trim()
        .isCurrency()
        .withMessage("Please provide a price. No commas or dollar signs."),
        
        // color is required and must be strong password
        body("inv_color")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a color."),
        
        // miles is required and must be strong password
        body("inv_miles")
        .trim()
        .isNumeric()
        .withMessage("Please provide a mileage. No commas."),
        
        // description is required and must be strong password
        body("inv_description")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a description."),
        
        // image is required and must be strong password
        body("inv_image")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide an image."),

        // thumbnail is required and must be strong password
        body("inv_thumbnail")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a thumbnail."),
]
    }

/* ******************************
* Check data and return the inv form or continue to inv      
* ***************************** */
validate.checkVehicleData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_price, inv_description, inv_image, inv_thumbnail } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.status(400).render("./inv/add-vehicle", {
            title: "Add Vehicle",
            nav,
            classifications: null,
            errors: errors.array(),
        })
    } else {
        next()
    }
}

/*  **********************************
* Check Update data and return to inv form or continue to inv
* ********************************* */
validate.checkUdateData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_price, inv_description, inv_image, inv_thumbnail, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.status(400).render("./inv/edit", {
            title: "Inv Edit",
            nav,
            classifications: null,
            errors: errors.array(),
        })
    } else {
        next()
    }
}

/*  **********************************
 *  Classification Data Validation Rules
* ********************************* */

validate.classificationRules = () => {
    
        return [
            // classification is required and must be string
            body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification."), // on error this message is sent.
    ]
        }

/* ******************************
* Check data and return to classification form or continue to classification
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.status(400).render("./inv/add-classification", {
            title: "Add Classification",
            nav,
            errors: errors.array(),
        })
    } else {
        next()
    }
}


module.exports = validate;