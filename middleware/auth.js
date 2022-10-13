const jwt = require("jsonwebtoken")

const auth = (req , res , next) =>{
    console.log(req.cookies);
    const token = 
        req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", '');
        // u should always put replace one in last otherwise it will show error
        if(!token){
            return res.status(403).send("token is missing")
        }

        try {
           const decode = jwt.verify(token, process.env.SECRET_KEY) 
           console.log(decode);
           req.user = decode;
        } catch (error) {
            return res.status(401).send("Invalid Token");
        }
    return next();
}

module.exports = auth;