const Pool = require("pg").Pool;
require("dotenv").config(); 

const pool = new Pool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    port: process.env.DB_PORT, 
    database: process.env.DB_DATABASE
}); 

module.exports = pool; 