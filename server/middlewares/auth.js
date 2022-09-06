const jwt = require('jsonwebtoken');

exports.loggedIn = async (req,res,next)=>{
    let token = req.header('Authorization');
    if(!token){
        return res.status(401).send("Access Denied");
    }
    try{
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.TOKEN_SECRET); 
        if(verified.email){ // Check authorization, 2 = Customer, 1 = Admin
            req.user = verified;
            next();
        }
        
    }
    catch (err) {
        return res.status(400).send("Invalid Token");
    }
}