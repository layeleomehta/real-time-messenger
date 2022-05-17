const express = require("express"); 
const { Server, Socket } = require("socket.io"); 
const helmet = require("helmet"); 
const PORT = 4000; 
const authRouter = require("./routers/authRouter"); 
const session = require("express-session"); 
const cors = require("cors"); 
require("dotenv").config(); 

const app = express(); 
const server = require("http").createServer(app); 

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        credentials: "true"
    }
});    

// middlewares
app.use(helmet()); 
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
})); 
app.use(express.json()); 
app.use(session({
    secret: process.env.COOKIE_SECRET, 
    credentials: true, 
    name: "session_id", 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        secure: "auto", 
        httpOnly: true, 
        expires: 1000*60*60*24*7, // this is one week in milliseconds
        sameSite: "lax"
    }
})); 

// routes
app.use("/auth", authRouter); 


io.on("connect", (socket) => {

}); 

server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`); 
})