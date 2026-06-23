const { error } = require("console");
const fs = require("fs");
const { URLSearchParams } = require("url");

const userrequestHandler = (req, res) => {
  console.log(req.url, req.method);
  res.setHeader("content-type", "text/html");

  if (req.url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write("<body>");
    res.write("<h1>Welcome to Home page</h1>");
    res.write('<form action="/submit-details" method="POST">');
    res.write(
      '<input type="text" id="name" name="name" placeholder="name"><br><br>',
    );
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
  } else if (
    req.url.toLowerCase() === "/submit-details" &&
    req.method === "POST"
  ) {
    // res.write("<html>");
    // res.write("<head><title>Success</title></head>");
    // res.write("<body><h1>Details submitted successfully!</h1><a href=\"/\">Go back to Home</a></body>");
    // res.write("</html>");

    const body = []; //store the chunks

    /*read single chunks*/
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    /*how the chunks store using buffer and get full body*/
    req.on("end", () => {
      const fullBody = Buffer.concat(body).toString();
      console.log(fullBody);

      /*parsing the body and get object and write the dynmic data into file*/
      const params = new URLSearchParams(fullBody);
      // const bodyObject = {};
      // for (const [key, val] of params.entries()) {
      //   bodyObject[key]=val;

      // }
      const bodyObject = Object.fromEntries(params);
      console.log(bodyObject);
      // fs.writeFileSync("user1.txt",JSON.stringify(bodyObject));//beacuse writefilesyncs is blocking the code thats why we do not use that
      fs.writeFile("user1.txt", JSON.stringify(bodyObject), (error) => {
        console.log("Data written successfully");
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  } else {
    res.write("<html>");
    res.write("<head><title>program</title></head>");
    res.write("<body><h1>404 not found</h1></body>");
    res.write("</html>");
    return res.end();
  }
};

module.exports = userrequestHandler;
