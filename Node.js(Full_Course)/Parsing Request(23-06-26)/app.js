const http = require("http");
const userRequestHandler = require("./chunk_buffer_with_parsing_node");

const server = http.createServer(userRequestHandler);

const PORT = 3002;

server.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});