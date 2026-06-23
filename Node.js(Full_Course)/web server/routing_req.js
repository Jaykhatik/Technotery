const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  res.setHeader("content-type", "text/html");

  if (req.url === "/") {
    res.write("<html>");
    res.write("<head><title>program</title></head>");
    res.write("<body><h1>Home Page</h1></body>");
    res.write("</html>");
    return res.end();
  } else if (req.url === "/products") {
    res.write("<html>");
    res.write("<head><title>program</title></head>");
    res.write("<body><h1>Products Page</h1></body>");
    res.write("</html>");
    return res.end();
  } else {
    res.write("<html>");
    res.write("<head><title>program</title></head>");
    res.write("<body><h1>404 not found</h1></body>");
    res.write("</html>");
    return res.end();
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
