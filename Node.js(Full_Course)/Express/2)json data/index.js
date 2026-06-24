const express = require("express");
const data = require("./data");
const app = express();

app.get("/", (req, res) => {
  console.log(req.url, req.method);
  res.send("<h1>Your express server is running successfully!!!</h1>");
});

//here we pass the array of object but still it convert automatic to json
app.get("/api", (req, res) => {
  console.log(req.url, req.method);
  res.send(data.users);
});

//send obje data variable
app.get("/api1", (req, resp) => {
  console.log(req.url, req.method);
  resp.send(data.people);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("Available routes:");
  console.log("  - http://localhost:3000/");
  console.log("  - http://localhost:3000/api");
  console.log("  - http://localhost:3000/api1");
});
