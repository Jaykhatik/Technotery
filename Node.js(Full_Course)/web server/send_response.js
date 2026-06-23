const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  res.setHeader("content-type", "text/html");
  res.write("<html>");
  res.write("<head><title>program</title></head>");
  res.write("<body><h1>hiii</h1></body>");
  res.write("</html>");
  res.end();
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
