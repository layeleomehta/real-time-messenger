const redisClient = require("../redis");

module.exports.authorizeUser = (socket, next) => {
    if(!socket.request.session || !socket.request.session.user){
        console.log("not authorized to connect to socket server"); 
        next(new Error("Not authorized!")); 
    } else {
        socket.user =  socket.request.session.user; 

        // this stores a key in Redis which corresponds to username, and maps to key-value pair of "userid" -> socket.user.userid. 
        // storing in Redis makes this publicly available, so we can access other people's userid's if we know their usernames
        redisClient.hset(`username:${socket.user.username}`, "userid", socket.user.userid); 
        next(); 
    }
}