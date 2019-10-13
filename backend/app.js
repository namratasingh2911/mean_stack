const express = require('express');
const path= require('path');
const http=require('http');
const mongoose=require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');


mongoose.connect("mongodb://localhost:27017/posts",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex: true,
})
.then(()=>{
 console.log("connected to db")
})
.catch(()=>{
  console.log("connection failed")
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images",express.static(path.join("backend/images")));



app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS,PUT')
    next();
});

app.use('/api/posts',postsRouter);
app.use('/api/users',usersRouter);



module.exports=app;

