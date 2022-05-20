module.exports.authorizeUser = (socket, next) => {
    if(!socket.request.session || !socket.request.session.user){
        console.log("not authorized to connect to socket server"); 
        next(new Error("Not authorized!")); 
    } else {
        next(); 
    }
}