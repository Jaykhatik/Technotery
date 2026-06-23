const http=require('http');
const testingSyntax = require('./syntax');
const runtimeSyntax = require('./runtime');
const LogicalError = require('./logical');

const server=http.createServer((req,res)=>{
    console.log(req.url,req.method);
    // testingSyntax();
    // runtimeSyntax();
    LogicalError();
})

const PORT=3000;
server.listen(PORT,()=>{
console.log(`server is running at http://localhost:${PORT}`)
})