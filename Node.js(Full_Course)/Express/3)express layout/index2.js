
var express=require('express');
var app=express();

const path = require('path');
var publicpath=path.join(__dirname,'public') // public sudhi no path

// sendFile()    // send file with with our routes
app.get('/',(req,resp)=>{
	resp.sendFile(`${publicpath}/index.html`);
})

app.get('/about',(req,resp)=>{
	resp.sendFile(`${publicpath}/about.html`);
})

app.get('/blog',(req,resp)=>{
	resp.sendFile(`${publicpath}/blog.html`);
})

app.get('/*path',(req,resp)=>{
	resp.sendFile(`${publicpath}/pnf.html`);
})

app.listen(3000);