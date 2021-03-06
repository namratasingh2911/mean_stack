const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

const User= require('../models/user');

exports.createuser=(req,res,next)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(req.body.password,salt)
    .then(hash => {
        const user= new User({
            email:req.body.email,
            password:hash
        })
        user.save()
        .then((result)=>{
            res.status(201).json({
                message:"User done!!",
                result:result
            })
         })
         .catch((err)=>{
            res.status(500).json({
                message:"Invalid authentication credentials"
            })

         })

    })
    });

}

exports.userLogin=(req,res,next)=>{
    let fetchedUser;
    User.findOne({email:req.body.email})
    .then(user=>{
        if(!user){
            return res.status(401).json({
                message:"Auth failed"
            })
        }
        fetchedUser=user;
        return bcrypt.compare(req.body.password,user.password)
    })
    .then(result=>{
     if(!result){
        return res.status(401).json({
            message:"Auth failed"
        })
     }
     const token=jwt.sign(
         {email:fetchedUser.email,id:fetchedUser._id},
         process.env.JWT_SIGN,
         {expiresIn:"1h"}
     )
     res.status(200).json({
         token:token,
         expiresIn:3600,
         userId : fetchedUser._id
     })

    })
    .catch(err=>{
     return res.status(404).json({
         message:"Invalid Authentication details!!"
     })
    })
}