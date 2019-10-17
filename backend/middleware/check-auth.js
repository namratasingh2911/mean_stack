const jwt= require('jsonwebtoken');

module.exports=(req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken=jwt.verify(token,process.env.JWT_SIGN);
        console.log(decodedToken);
        req.userData= {email:decodedToken.email,userId:decodedToken.id};
        next();
       }
    catch(error){
        res.status(404).json({
            message:"You are not authenticated"
        })
       }
    

}