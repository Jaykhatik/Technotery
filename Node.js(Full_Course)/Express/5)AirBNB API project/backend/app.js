const path = require("path");
const express = require("express");
const userRouter = require("./routes/useRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRoutes");
const errorController = require("./controllers/errorController");

const app = express();

// 2. Global Middlewares (Always parse body & serve static files FIRST)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


// 3. Routing
app.use(userRouter);
app.use("/host", hostRouter);
app.use("/auth", authRouter);

// 4. Error Handling (Must be last)
app.use(errorController.get404);

// Export the fully configured express app
module.exports = app;
