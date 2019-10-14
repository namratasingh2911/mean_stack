const express= require('express');
const router= express.Router();
const Post = require('../models/post');
const multer= require('multer');
const checkAuth=require('../middleware/check-auth');

const MIME_TYPE_MAP ={
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpg'

}
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        const isValid=MIME_TYPE_MAP[file.mimetype];
        console.log(isValid);
        let error= new Error("Invalid mime type");
        if(isValid){
            error=null
        }
        cb(error,"backend/images");
    },
    filename : (req,file,cb)=>{
        const name= file.originalname.toLowerCase().split(' ').join('-');
        const ext=MIME_TYPE_MAP[file.mimetype];
        cb(null,name+'-'+Date.now()+'.'+ext);
    }
});

router.post('',checkAuth,multer({storage:storage}).single("image"),(req,res,next)=>{
    const url= req.protocol + '://'+ req.get("host");
    const post= new Post({
        title: req.body.title,
        content:req.body.content,
        imagePath:url+"/images/"+req.file.filename,
        creator:req.userData.userId
    });
  
    post.save().then(responseData=>{
        console.log(responseData);
        res.status(201).json({
            message : 'Post Added Successfully',
            post:{
                id : responseData._id,
                title:responseData.title,
                content:responseData.content,
                imagePath:responseData.imagePath
            }
        });
    }).catch(err=> res.status(400).json({err:err}));
    
    
})

router.put('/:id',checkAuth,multer({storage:storage}).single("image"),(req,res,next)=>{
   let imagePath = req.body.imagePath;
   console.log('File',req.file);
    if(req.file){
        console.log("i am in if");
    const url= req.protocol + '://'+ req.get("host"); 
    imagePath= url+"/images/"+req.file.filename  
   } 
    const post= new Post({
        _id:req.params.id,
        title : req.body.title,
        content: req.body.content,
        imagePath:imagePath,
        creator:req.userData.userId
    })

    console.log('Post',post.imagePath);
    Post.updateOne({_id:req.params.id,creator:req.userData.userId},post)
    .then((result)=>{
        console.log('Result',result)
        if(result.nModified > 0){
            res.status(200).json({
                message:"update Successfully",
                imagePath:post.imagePath
            })
        }
        else {
            res.status(401).json({
                message:"Not Authorized"
            })
        }
        
    })
})

router.get('/:id',(req,res,next)=>{
    Post.findById(req.params.id).then(
        (post)=>{
            if(post){
            res.status(200).json(post);
            }
            else {
            res.status(400).json({message : "Post Not found"});
            }
        }
    )
})

router.get('',(req,res,next)=>{
    const pageSize=+req.query.pageSize;
    const currentpage=+req.query.page;
    const postQuery=Post.find();
    let fetchedPosts;
    if(pageSize && currentpage){
     postQuery
     .skip(pageSize*(currentpage-1))
     .limit(pageSize);
    }
    postQuery.then((documents)=>{
        fetchedPosts=documents;
       return Post.count();
        }).then(count => {
         res.status(200).json({
             message:"Posts fetched succesfully",
             posts:fetchedPosts,
             maxPosts:count
         })
        })
    })


router.delete('/:id',checkAuth,(req,res,next) =>{
 Post.deleteOne({_id:req.params.id,creator:req.userData.userId})
 .then((result)=>{
  console.log(result)
  if(result.n > 0){
    res.status(200).json({
        message:"delete Successfully"
    })
}
else {
    res.status(401).json({
        message:"Not Authorized"
    })
}
 })
 
})


module.exports=router;