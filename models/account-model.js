const pool = require("../database/")


/* *************************************************************
* Register a new account
* ************************************************************* */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *"
      const account = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
      return account.rows[0]
    } catch (error) {
      return error.message
    }
  }


/* **********************
 * Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

  
module.exports = {registerAccount, checkExistingEmail};