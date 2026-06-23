const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);
  res.setHeader("content-type", "text/html");

  if (req.url === "/home") {
    res.write('<h1>welcome to home page</h1>');
    return res.end();
  } else if (req.url === "/men") {
    res.write('<h1>welcome to men page</h1>');
    return res.end();
  } else if (req.url === "/women") {
    res.write('<h1>welcome to women page</h1>');
    return res.end();
  } else if (req.url === "/kids") {
     res.write('<h1>welcome to kids page</h1>');
    return res.end();
  } else if (req.url === "/cart") {
     res.write('<h1>welcome to cart page</h1>');
    return res.end();
  } 
  res.write(`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <nav>
                <ul>
                    <li><a href="/home">home</a></li>
                    <li><a href="/men">men</a></li>
                    <li><a href="/women">women</a></li>
                    <li><a href="/kids">kids</a></li>
                    <li><a href="/cart">cart</a></li>
                </ul>
            </nav>
        </body>
        </html>

        `);
        res.end();
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
