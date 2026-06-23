const http = require("http");
const fs=require("fs");

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  res.setHeader("content-type", "text/html");

  if (req.url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write("<body>");
    res.write("<h1>Welcome to Home page</h1>");
    res.write('<form action="/submit-details" method="POST">');
    res.write('<input type="text" id="name" name="name" placeholder="name"><br><br>');
    res.write('<label for="gender">Gender:</label>');
    res.write('<input type="radio" id="male" name="gender" value="male">');
    res.write('<label for="male">Male</label>');
    res.write('<input type="radio" id="female" name="gender" value="female">');
    res.write('<label for="female">Female</label><br><br>');
    res.write('<button type="submit">Submit</button>');
    res.write("</form>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  } else if (req.url.toLowerCase() === "/submit-details" && req.method === "POST") {
    // res.write("<html>");
    // res.write("<head><title>Success</title></head>");
    // res.write("<body><h1>Details submitted successfully!</h1><a href=\"/\">Go back to Home</a></body>");
    // res.write("</html>");
    fs.writeFileSync('user.txt','jay khatik');
    res.statusCode=302;
    res.setHeader("Location","/");
    return res.end();
  } else {
    res.write("<html>");
    res.write("<head><title>program</title></head>");
    res.write("<body><h1>404 not found</h1></body>");
    res.write("</html>");
    return res.end();
  }
});
const PORT = 3002;
server.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
