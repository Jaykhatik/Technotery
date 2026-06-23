const {sumRequest } = require("./sum");

const requestHandler = (req, res) => {
  console.log(req.url, req.method);
  res.setHeader("content-type", "text/html");

  if (req.url === "/") {
    res.write(`
        <html>
            <head>
                <title>Calculator</title>
            </head>
            <body>
                <h1>welcome to homepage</h1>

                <a href="/calculator">Go to Calculator page</a>
            </body>
        </html>
        `);
    return res.end();
  } else if (req.url.toLowerCase() === "/calculator") {
    res.write(`
        <html>
            <head>
                <title>Calculator</title>
            </head>
            <body>
                <h1>Calculator :</h1>
                <form action="/calculator-result" method="POST">
                    <input type="text" placeholder="enter first number" name="first"/>
                    <input type="text" placeholder="enter second number" name="second"/>
                    <input type="submit" val="Sum"/>
                </form>
            </body>
        </html>
        `);
        return res.end();
  }
  else if(req.url.toLowerCase()==="/calculator-result" && req.method==="POST"){
      return sumRequest(req,res);

  }
  res.write(
    `
     <html>
            <head>
                <title>Calculator</title>
            </head>
            <body>
                <h1>404 Page Not Found</h1>

                <a href="/">Go to Home page</a>
            </body>
        </html>
    `,
  );
};

exports.requestHandler = requestHandler;
