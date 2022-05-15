const express = require("express"); 
const router = express.Router(); 
const validateForm = require("../controllers/validateForm"); 


// handle login request
router.post("/login", (req, res) => {
    validateForm(req, res); 
})

// handle signup request
router.post("/signup", (req, res) => {
    validateForm(req, res);
})

module.exports = router; 