const pool = require("../database/")
const bcrypt = require("bcryptjs")

/* *****************************
*   Register new account
* *************************** */

async function accountRegister(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4,'Client') RETURNING *"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    return result;
  } catch (error) {
    
    return error.message;
  }
}

/* *****************************
*   Check for existing email
* *************************** */

async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount

  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email
* *************************** */

async function getAccountByEmail(account_email){
  try {
    const result = await pool.query('SELECT account_id, account_firstname, account-lastname, account_email, account_password FROM account WHERE account_email = $1', 
    [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
 * Check for user email
  * *************************** */
async function checkUserEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount

  } catch (error) {
    return error.message
  }
}

/* *****************************
 * Return account data using email
 * *************************** */

async function getAccountByEmail(account_email){
  try {
    const result = await pool.query('SELECT account_id, account_firstname, account_lastname, account_email, account_password FROM account WHERE account_email = $1', 
    [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
 * Check password
 * *************************** */

async function checkPassword(account_email, account_password){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])

    if (result.rows.length > 0){
      const storedPassword = result.rows[0].account_password
      return await bcrypt.compare(account_password, storedPassword)
}
    return false
  } catch (error) {
    throw error
  }
}

/* *****************************
  * Get Account by ID
  * *************************** */

async function getAccountById(account_id){
  try {
    const result = await pool.query('SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1', 
    [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}


/* *****************************
* Update account data on id (desired output == 1)
* ***************************** */
async function updateAccountInfo(account_firstname, account_lastname, account_email, account_id) {
  try {
    // get account info on account_id, returns all account info
    const result = await pool.query(
      'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4',
      [account_firstname, account_lastname, account_email, account_id])
    return result.rowCount
  } catch (error) {
    // return if update fails
    console.error("updateaccountinfo error " + error)
  }
}

/* *****************************
* Change account password on account_id (desired output == 1)
* ***************************** */
async function changeAccountPassword(account_password, account_id) {
  try {
    // get account info on account_id, returns all account info
    const result = await pool.query(
      'UPDATE account SET account_password = $1 WHERE account_id = $2',
      [account_password, account_id])
    return result.rowCount
  } catch (error) {
    // return if update fails
    console.error("changeaccountpassword error " + error)
  }
}

module.exports = {
  accountRegister, 
  checkExistingEmail, 
  getAccountByEmail, 
  checkUserEmail, 
  getAccountByEmail, 
  checkPassword,
  getAccountById,
  updateAccountInfo,
  changeAccountPassword}