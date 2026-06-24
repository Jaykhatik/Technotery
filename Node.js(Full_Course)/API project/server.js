// Step 1: Import the core HTTP module
const http = require("http");
const fs = require("fs"); // Import the file system module

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/api/users") {
    if (req.method === "GET") {
      res.writeHead(200);
      const data = fs.readFileSync("data.json", "utf-8");
      res.end(data);
    }

    else if (req.method === "POST") {
      let body = "";

      // Listen for data chunks coming from the client
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      // When all data is received
      req.on("end", () => {
        // Parse the JSON string from the client back into a Javascript object
        const parsedBody = JSON.parse(body);

        // Read the existing data
        let currentUsers = JSON.parse(fs.readFileSync("data.json", "utf-8"));

        // Create a new user object
        const newUser = {
          id: currentUsers.length + 1, 
          name: parsedBody.name,
          role: parsedBody.role,
        };

        // Add to our database
        currentUsers.push(newUser);
        
        fs.writeFileSync("data.json", JSON.stringify(currentUsers, null, 2));
        res.writeHead(201); 
        res.end(
          JSON.stringify({
            message: "User created successfully!",
            user: newUser,
          }),
        );
      });
    }
  } 
  
  else if (req.url.startsWith("/api/users/") && req.method === "DELETE") {
    const id = parseInt(req.url.split("/")[3]);
    let currentUsers = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    const updatedUsers = currentUsers.filter((user) => user.id !== id);
    fs.writeFileSync("data.json", JSON.stringify(updatedUsers, null, 2));
    res.writeHead(200);
    res.end(JSON.stringify({ message: "User deleted successfully!" }));

  } else if (req.url === "/api") {
    res.writeHead(200);
    res.end(
      JSON.stringify({ message: "Your server is running successfully!!!" }),
    );
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/api/users`);
});
