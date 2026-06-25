const path = require("path");

const express = require("express");
const userRouter = require("./routes/useRouter");
const hostRouter = require("./routes/hostRouter");
const pathUtil = require("./utils/pathUtil");

const app = express();

app.use(express.urlencoded());
app.use(userRouter);
app.use("/host", hostRouter);
app.use(express.static(path.join(pathUtil,'public')));//for make public folder css for public use

const errorController = require("./controllers/errorController");
app.use(errorController.get404);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
