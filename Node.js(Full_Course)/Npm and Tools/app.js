const http = require("http");

const server = http.createServer((req,res)=>{
  console.log(req.url,req.method);
});

const PORT = 3002;

server.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});