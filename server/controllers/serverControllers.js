require("dotenv").config(); 
const session = require("express-session"); 
const RedisStore = require("connect-redis")(session); 
const redisClient = require("../redis"); 


const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET, 
    credentials: true, 
    name: "session_id",
    store: new RedisStore({
        client: redisClient
    }), 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        secure: "auto", 
        httpOnly: true, 
        expires: 1000*60*60*24*7, // this is one week in milliseconds
        sameSite: "lax"
    }
}); 

const wrapper = (expressMiddleware) => (socket, next) => {
    expressMiddleware(socket.request, {}, next); 
}

const corsConfig = {
    origin: "http://localhost:3000",
    credentials: true
}

module.exports = { sessionMiddleware, wrapper, corsConfig }; 