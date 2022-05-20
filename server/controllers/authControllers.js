const db = require("../database/db"); 
const bcrypt = require("bcrypt"); 
const {v4: uuidv4} = require("uuid"); 

module.exports.checkSessionExists = (req, res) => {
    // if user key exists in session, and there is a user in there, this means user is already authenticated, don't need
    // to perform another login
    if(req.session.user && req.session.user.username){
        res.json({
            loggedIn: true, 
            username: req.session.user.username
        }); 
        return; 
    } else {
        res.json({
            loggedIn: false
        }); 
        return; 
    }
}

module.exports.attemptLogin = async (req, res) => {
    try {
        const existingUsersQuery = await db.query("SELECT * FROM users WHERE username=$1", [req.body.username]); 

        // check if req body username already exists, if it does then proceed with authentication
        if(existingUsersQuery.rowCount === 0){
            res.json({
                loggedIn: false, 
                status: "There is no user yet with this username!", 
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

        // set session  
        req.session.user = {
            username: req.body.username, 
            id: existingUsersQuery.rows[0].id, 
            userid: existingUsersQuery.rows[0].userid
        }        

        // send back json object with loggedIn state and username
        res.json({
            loggedIn: true, 
            username: req.body.username
        }); 

    } catch (err) {
        console.error(err.message); 
    }
}

module.exports.attemptSignup = async (req, res) => {
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
        const savePasswordQuery = await db.query("INSERT INTO users(username, password_hash, userid) VALUES($1, $2, $3) RETURNING *", [
            req.body.username, 
            hashed_password, 
            uuidv4()
        ]); 

        // set session 
        req.session.user = {
            username: req.body.username, 
            id: savePasswordQuery.rows[0].id, 
            userid: savePasswordQuery.rows[0].userid
        }

        // send back json object with username and logged in state
        res.json({
            loggedIn: true, 
            username: req.body.username
        }); 

    } catch (err) {
        console.error(err.message); 
    }
}