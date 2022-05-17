const express = require("express"); 
const router = express.Router(); 
const validateForm = require("../controllers/validateForm"); 
const db = require("../database/db"); 
const bcrypt = require("bcrypt"); 


// handle login request
router.post("/login", (req, res) => {
    validateForm(req, res); 
})

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

        // save a session on server

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