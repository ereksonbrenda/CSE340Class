
const pool = require("../database/")

/* *************************************************************
 * Get all classification data
 * ************************************************************* */
async function getClassifications() {
  // Execute a SQL query to select all classifications from the "public.classification" table, ordered by classification name
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}
/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

  /* ***************************
  *  Get inventory detail by inventory_id
  * ************************** */
  async function getInventoryDetailById(inventory_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS item 
        WHERE item.inv_id = $1`,
        [inventory_id]
      )
      if (data.length === 0) {
        throw new Error("ModelError: Unable to find inventory item")
      }else{
        return data.rows
      }
    } catch (error) {
      console.error("getInventoryDetailById error " + error)
    }
  }

  /* ***************************
  * Add new classification
  * ************************** */
  async function addClassification(classification_name){
    try {
      const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /* ***************************
  * Add new inventory item
  * ************************** */
  async function addVehicle(classification_id, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_price, inv_description, inv_image, inv_thumbnail){
    try {
      const sql = "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_price, inv_description, inv_image, inv_thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
      return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_price, inv_description, inv_image, inv_thumbnail])
    } catch (error) {
      console.log(error)
      throw new Error(error.message);
    }
  }

  /* ***************************
  * Add new inventory item
  * ************************** */
  async function updateInventory(inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id){
   try {
          const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10, WHERE inv_id = $11 RETURNING *"
          const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
          return data.rows[0]
        } catch (error) {
      console.error("model error: " + error)
      throw new Error(error.message);
    }
  }

/* ***************************
 *  DELETE InventoryItem WEEK 5
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}


  module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getInventoryDetailById,
    addClassification,
    addVehicle,
    updateInventory,
    deleteInventory
  };