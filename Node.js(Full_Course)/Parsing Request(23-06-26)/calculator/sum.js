const { URLSearchParams } = require("url");

const sumRequest = (req, res) => {
  console.log("In sum request handler", req.url);
  const body = [];
  req.on("data", (chunk) => {
    body.push(chunk);
  });
  req.on("end", () => {
    const bodyStr = Buffer.concat(body).toString();
    console.log(bodyStr);
    const params = new URLSearchParams(bodyStr);
    console.log(params);
    const bodyObj = Object.fromEntries(params);
    console.log(bodyObj);
    const result = Number(bodyObj.first) + Number(bodyObj.second);
    console.log(result);

    res.setHeader("content-type", "text/html");
    res.write(
      `
     <html>
            <head>
                <title>Calculator</title>
            </head>
            <body>
                <h1>Your sum is ${result}</h1>
            </body>
        </html>
    `,
    );
    return res.end();
  });
};

exports.sumRequest = sumRequest;
