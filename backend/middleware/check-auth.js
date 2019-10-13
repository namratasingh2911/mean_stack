const jwt= require('jsonwebtoken');

module.exports=(req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken=jwt.verify(token,'Secret this should be very strong');
        console.log(decodedToken);
        req.userData= {email:decodedToken.email,userId:decodedToken.id};
        next();
       }
    catch(error){
        res.status(404).json({
            message:"Auth Failed!!"
        })
       }
    

}