const bycrypt = require("bcryptjs")
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const accountController = {}



/* ************************
* Deliver Login View
************************** */
accountController.buildLogin = async function(req, res, next){
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}


/* ************************
* Process Login
************************** */
accountController.loginAccount = async function(req, res, next){
let nav = await utilities.getNav()
const { account_email, account_password } = req.body;

try {
    const account = await accountModel.getAccountByEmail(account_email);
    if (account) {
        const validPassword = await bycrypt.compareSync(
            account_password,
            account.account_password
        );
        if (validPassword) {
            req.session.account = account;
            req.flash("success", `Welcome back ${account.account_firstname}`);
            res.status(201).redirect("/"); // redirect to home page
        } else {
            req.flash("notice", "Sorry, invalid login");
            res.status(401).render("account/login", {
                title: "Login",
                nav,
                errors: null
            });
        }
    }
}
catch (error) {
    req.flash("notice", "Sorry, invalid login");
    res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: null
    });
}
}



/* ************************
* Deliver Registration View
************************** */
accountController.buildRegister = async function(req, res,next){
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ************************
* Process Registration
************************** */
accountController.registerAccount = async (req, res) => {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    // Hash the password before storing
    //let hashedPassword;
    try {
        // regular password and cost (salt is generated automatically)
        //hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash("notice", `Sorry, there was an error processing the registration`);
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        });
    }
    try {
        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            account_password
            //hashedPassword
        );
        if (regResult) {
            req.flash(
                "success",
                `Congratulations, you're registered ${account_firstname}. Please log in.`
            );
            res.status(201).render("account/login", {
                title: "Login",
                nav,
                errors: null
            });
        }
    } catch (error) {
        req.flash("notice", "Sorry, the registration failed")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        });
    }
}




module.exports = accountController;

