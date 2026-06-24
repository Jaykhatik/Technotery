const path = require("path");

const express = require("express");
const userRouter = require("./routes/useRouter");
const hostRouter = require("./routes/hostRouter");

const app = express();
app.use(express.urlencoded());

app.use(userRouter);
app.use("/host", hostRouter);

//add custome 404 page with status
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "pnf.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
