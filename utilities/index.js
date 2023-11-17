const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inventory/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the inventory grid HTML
 ************************** */
Util.buildClassificationGrid = async function (data) {
  let grid = '<div class="grid-container">'
  data.forEach((row) => {
    grid += '<div class="grid-item">'
    grid += '<a href="/inventory/' + row.vehicle_id + '">'
    grid += '<img src="/images/' + row.vehicle_id + '.jpg" alt="'
    grid += row.year + " " + row.make_name + " " + row.model_name + '">'
    grid += "</a>"
    grid += "</div>"
  })
  grid += "</div>"
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util