const express=require('express');
const app=express();

app.get('/',(req,res)=>{
		console.log(req.url,req.method);
		res.send('<h1>Hello</h1>');
		// object auto convert in json
		// res.send({name:'Raj', email:'raj@gmail.com'})
});

app.get('/about',(req,res)=>{	
    console.log(req.url,req.method);
		res.send('<h1>about</h1>');
});

app.listen(5000);