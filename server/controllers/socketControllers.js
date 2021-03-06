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
    socket.join(socket.user.userid); 
    // this stores a key in Redis which corresponds to username, and maps to key-value pair of "userid" -> socket.user.userid. 
    // storing in Redis makes this publicly available, so we can access other people's userid's if we know their usernames
    redisClient.hset(`username:${socket.user.username}`, 
                     "userid", 
                     socket.user.userid, 
                     "connected", 
                     true); 

    // get the user's friendlist from redis and send it back to the client
    const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1); 
    console.log(`friends for username:${socket.user.username} are: ${friendList}`); 

    const parsedList = await parseFriendList(friendList); 
    // list of all rooms, and each room is a userid
    const friendRooms = parsedList.map(friend => friend.userid); 
    // send 'connected' event to each 'room' channel so they know we are logged in
    if(friendRooms.length > 0 ){
        socket.to(friendRooms).emit("connected", true, socket.user.username); 
    }
    
    // emit 'friends' event so frontend can know who all user's friends are for rendering sidebar
    socket.emit("friends", parsedList); 

    // do smth similar for messages upon initialization
    const msgQuery = await redisClient.lrange(
        `chat:${socket.user.userid}`,
        0,
        -1
      );
    
      // to.from.content
      const messages = msgQuery.map(msgStr => {
        const parsedStr = msgStr.split(".");
        return { to: parsedStr[0], from: parsedStr[1], content: parsedStr[2] };
      });
    
      if (messages && messages.length > 0) {
        socket.emit("messages", messages);
      }
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
    const friend = await redisClient.hgetall(`username:${friendName}`); 
    console.log(`Friend:${friendName}, with userid: ${friend.userid}`); 

    // if friend is null that means it doesn't exist in redis, which means user doesn't exist
    if(!friend){
        console.log("That user doesn't exist"); 
        cb({done: false, errorMsg: "That user doesn't exist!"}); 
        return; 
    }

    // get friend list of logged in user from redis (to see if the friendName doesn't already exist)
    const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1); 
    // this if statement means friendName exists inside friendList (therefore we'd be adding duplicates)
    if(friendList && friendList.indexOf(`${friendName}.${friend.userid}`) !== -1){
        console.log("you already have this person as a friend!"); 
        cb({done: false, errorMsg: "This person is already your friend!"}); 
        return; 
    }

    // push the new friend into ur friend list
    await redisClient.lpush(`friends:${socket.user.username}`, [friendName, friend.userid].join("."));

    const newFriend = {
        username: friendName, 
        userid: friend.userid, 
        connected: friend.connected
    }
 
    cb({done: true, newFriend}); 
}


// disconnect user 
module.exports.onDisconnect = async (socket) => {
    // console.log("inside onDisconnect function"); 
    // set connection status to false in Redis
    await redisClient.hset(`username:${socket.user.username}`, "connected", false); 

    // emit disconnect event to all room channels who u can communicate with (these are all userids in friendList)
    const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1); 

    const parsedList = await parseFriendList(friendList); 
    // list of all rooms, and each room is a userid
    const friendRooms = parsedList.map(friend => friend.userid); 
    // send 'connected' event to each 'room' channel so they know we are logged in
    if(friendRooms.length > 0 ){
        socket.to(friendRooms).emit("connected", false, socket.user.username); 
    }
}

module.exports.dm = async (socket, message) => {
    message.from = socket.user.userid;
    // to.from.content
    const messageString = [message.to, message.from, message.content].join(
      "."
    );
  
    await redisClient.lpush(`chat:${message.to}`, messageString);
    await redisClient.lpush(`chat:${message.from}`, messageString);
  
    socket.to(message.to).emit("dm", message);
}

// return array of all friends, each item in array is object with friend username, userid and connection status. 
// this function is necessary, bcuz the friend list in Redis only stores "username.userid", we have to 
// query Redis for the connection status 
const parseFriendList = async (friendList) => {
    let parsedList = []

    for(let friend of friendList){
        parsedFriend = friend.split("."); 
        const friend_username = parsedFriend[0]; 
        const friend_userid = parsedFriend[1]; 
        const friend_connected = await redisClient.hget(`username:${friend_username}`, "connected"); 

        parsedList.push({
            username: friend_username, 
            userid: friend_userid, 
            connected: friend_connected
        }); 
    }

    return parsedList; 
}