const express = require("express"); 
const { Server } = require("socket.io"); 
const helmet = require("helmet"); 
const PORT = 4000; 
const authRouter = require("./routers/authRouter"); 
const cors = require("cors"); 
require("dotenv").config(); 
const {sessionMiddleware, wrapper, corsConfig} = require("./controllers/serverControllers"); 

const app = express(); 
const server = require("http").createServer(app); 


const io = new Server(server, {
    cors: corsConfig
});    

// middlewares
app.use(helmet()); 
app.use(cors(corsConfig)); 
app.use(express.json()); 
app.use(sessionMiddleware); 

// routes
app.use("/auth", authRouter); 

io.use(wrapper(sessionMiddleware)); 
io.on("connect", (socket) => {
    console.log(socket.request.session); 
}); 

server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`); 
})