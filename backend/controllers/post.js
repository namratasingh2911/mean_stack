const Post = require('../models/post');
exports.createPosts=(req,res,next)=>{
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
    }).catch(err=> res.status(500).json({message:"Adding Post Failed"}));
    
    
}

exports.updatePosts=(req,res,next)=>{
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
         if(result.n > 0){
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
         
     }).catch(err=>{
         res.status(500).json({
             message:"Unable to update the post"
         })
     })
 }

 exports.getPost=(req,res,next)=>{
    Post.findById(req.params.id).then(
        (post)=>{
            if(post){
            res.status(200).json(post);
            }
            else {
            res.status(400).json({message : "Post Not found"});
            }
        }
    ).catch(error=>{
        res.status(500).json({
            message :"Fetching Post failed"
        })
    })
}

exports.getPosts=(req,res,next)=>{
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
    }

exports.deletePosts=(req,res,next) =>{
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
    }).catch(error=>{
       res.status(500).json({
           message :"Unable to delete the post"
       })
   })
    
   }
   