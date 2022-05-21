const redisClient = require("../redis");

module.exports.authorizeUser = (socket, next) => {
    if(!socket.request.session || !socket.request.session.user){
        console.log("not authorized to connect to socket server"); 
        next(new Error("Not authorized!")); 
    } else {
        next(); 
    }
}

module.exports.initializeUser = async (socket) => {
    socket.user =  {...socket.request.session.user};  
    // this stores a key in Redis which corresponds to username, and maps to key-value pair of "userid" -> socket.user.userid. 
    // storing in Redis makes this publicly available, so we can access other people's userid's if we know their usernames
    redisClient.hset(`username:${socket.user.username}`, "userid", socket.user.userid); 

    // get the user's friendlist from redis and send it back to the client
    const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1); 
    console.log(`friends for username:${socket.user.username} are: ${friendList}`); 

    socket.emit("friends", friendList); 
}

// adding a friend when user clicks submit on add friend modal
module.exports.addFriend = async (socket, friendName, cb) => {
    // first check if received friendName is not same as the logged in user
    if(socket.user.username === friendName){
        console.log("cannot add urself!"); 
        cb({done: false, errorMsg: "Cannot add self!"}); 
        return; 
    }

    // check if friendName is a valid user that has an account by getting userid from redis
    const friendUserID = await redisClient.hget(`username:${friendName}`, "userid"); 
    console.log(`Friend:${friendName}, with userid: ${friendUserID}`); 

    // if userid is null, that means it doesn't exist in redis, which means user doesn't exist
    if(!friendUserID){
        console.log("That user doesn't exist"); 
        cb({done: false, errorMsg: "That user doesn't exist!"}); 
        return; 
    }

    // get friend list of logged in user from redis (to see if the friendName doesn't already exist)
    const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1); 
    // this if statement means friendName exists inside friendList (therefore we'd be adding duplicates)
    if(friendList && friendList.indexOf(friendName) !== -1){
        console.log("you already have this person as a friend!"); 
        cb({done: false, errorMsg: "This person is already your friend!"}); 
        return; 
    }

    // push the new friend into ur friend list
    await redisClient.lpush(`friends:${socket.user.username}`, friendName);
    cb({done: true}); 
}