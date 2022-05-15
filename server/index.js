const express = require("express"); 
const { Server, Socket } = require("socket.io"); 
const helmet = require("helmet"); 
const PORT = 4000; 
const authRouter = require("./routers/authRouter"); 

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
app.use(express.json()); 

// routes
app.use("/auth", authRouter); 

io.on("connect", (socket) => {

}); 

server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`); 
})