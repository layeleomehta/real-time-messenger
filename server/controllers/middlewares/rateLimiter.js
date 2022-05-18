const redisClient = require("../../redis"); 

module.exports.rateLimiter = (secondsLimit, amountLimit) => {
    return async (req, res, next) => {
    const ip = req.connection.remoteAddress; 

    // store ip as key in redis 
    const response = await redisClient.multi().incr(ip).expire(ip, secondsLimit).exec(); 
    console.log(response[0][1]); 
    if(response[0][1] > amountLimit){
        res.json({
            loggedIn: false, 
            status: "Slow down!! Try again in a few minutes"
        })
    } else {
        next(); 
    }
  }
}