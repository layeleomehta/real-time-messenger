const express = require("express"); 
const router = express.Router(); 
const validateForm = require("../controllers/middlewares/validateForm"); 
const {checkSessionExists, attemptLogin, attemptSignup} = require("../controllers/authControllers")
const {rateLimiter} = require("../controllers/middlewares/rateLimiter"); 

// handle login request
router.route("/login")
    .get(checkSessionExists)
    .post(validateForm, rateLimiter(60, 10), attemptLogin); 

// handle signup request
router.post("/signup", validateForm, rateLimiter(30, 4), attemptSignup); 

module.exports = router; 