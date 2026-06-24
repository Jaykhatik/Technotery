
var express=require('express');
var app=express();

const path = require('path');
var publicPath=path.join(__dirname,'public') // public sudhi no path

// we can access any static page from path
app.use(express.static(publicPath));  

app.listen(3000);
// we can access direct pages from public folder so extention display problem
// http://localhost:3000/about.html