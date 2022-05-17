const express = require("express"); 
const router = express.Router(); 
const validateForm = require("../controllers/validateForm"); 
const db = require("../database/db"); 
const bcrypt = require("bcrypt"); 


// handle login request
router.post("/login", async (req, res) => {
    validateForm(req, res); 
    
    try {
        const existingUsersQuery = await db.query("SELECT * FROM users WHERE username=$1", [req.body.username]); 

        // check if req body username already exists, if it does then proceed with authentication
        if(existingUsersQuery.rowCount === 0){
            res.json({
                loggedIn: false, 
                status: "There is no user yet with this username!"
            })
            return; 
        } 
        
        // compare req body password with password in database, if matches then user is authenticated
        const isValid = await bcrypt.compare(req.body.password, existingUsersQuery.rows[0].password_hash); 
        if(!isValid){
            res.json({
                loggedIn: false, 
                status: "Username or password is incorrect!"
            }); 
            return; 
        }

        // set session cookie 
        req.session.user = {
            username: req.body.username, 
            id: existingUsersQuery.rows[0].id
        }        

        // send back json object with loggedIn state and username
        res.json({
            loggedIn: true, 
            username: req.body.username
        }); 

    } catch (err) {
        console.error(err.message); 
    }
}); 

// handle signup request
router.post("/signup", async (req, res) => {
    validateForm(req, res);

    // check if req body username already exists
    try {
        const response = await db.query("SELECT * FROM users WHERE username=$1", [req.body.username]); 

        // if username already exists
        if(response.rowCount > 0){
            res.json({
                loggedIn: false, 
                status: "The username or password is already taken!"
            }); 
            return; 
        }

        // if unique username, hash password and save in db
        const hashed_password = await bcrypt.hash(req.body.password, 10); 
        const savePasswordQuery = await db.query("INSERT INTO users(username, password_hash) VALUES($1, $2) RETURNING *", [
            req.body.username, 
            hashed_password
        ]); 

        // set session cookie
        req.session.user = {
            username: req.body.username, 
            id: savePasswordQuery.rows[0].id
        }

        // send back json object with username and logged in state
        res.json({
            loggedIn: true, 
            username: req.body.username
        }); 

    } catch (err) {
        console.error(err.message); 
    }
}); 

module.exports = router; 