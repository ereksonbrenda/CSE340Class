
const pool = require("../database")

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
 *  Get all inv items and classification_name by classification_id
 * ************************** */
async function getInvByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inv AS i 
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
  *  Get inv detail by inv_id
  * ************************** */
  async function getInvDetailById(inv_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inv AS item 
        WHERE item.inv_id = $1`,
        [inv_id]
      )
      if (data.length === 0) {
        throw new Error("ModelError: Unable to find inv item")
      }else{
        return data.rows
      }
    } catch (error) {
      console.error("getInvDetailById error " + error)
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
  * Add new inv item
  * ************************** */
  async function addVehicle(classification_id, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_price, inv_description, inv_image, inv_thumbnail){
    try {
      const sql = "INSERT INTO public.inv (classification_id, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_price, inv_description, inv_image, inv_thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
      return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_price, inv_description, inv_image, inv_thumbnail])
    } catch (error) {
      console.log(error)
      throw new Error(error.message);
    }
  }

  /* ***************************
  * Add new inv item
  * ************************** */
  async function updateInv(inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id){
   try {
          const sql = "UPDATE public.inv SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10, WHERE inv_id = $11 RETURNING *"
          const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
          return data.rows[0]
        } catch (error) {
      console.error("model error: " + error)
      throw new Error(error.message);
    }
  }

/* ***************************
 *  DELETE InvItem WEEK 5
 * ************************** */
async function deleteInv(inv_id) {
  try {
    const sql = 'DELETE FROM inv WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inv Error")
  }
}


  module.exports = {
    getClassifications,
    getInvByClassificationId,
    getInvDetailById,
    addClassification,
    addVehicle,
    updateInv,
    deleteInv
  };