const express= require('express');
const router= express.Router();
const PostController= require('../controllers/post');
const checkAuth=require('../middleware/check-auth');
const extractFile=require('../middleware/file');


router.post('',checkAuth,extractFile,PostController.createPosts)

router.put('/:id',checkAuth,extractFile,PostController.updatePosts)

router.get('/:id',PostController.getPost)

router.get('',PostController.getPosts)

router.delete('/:id',checkAuth,PostController.deletePosts)

module.exports=router;