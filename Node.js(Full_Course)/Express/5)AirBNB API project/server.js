const env = require("./config/env");
const app = require("./app");

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
