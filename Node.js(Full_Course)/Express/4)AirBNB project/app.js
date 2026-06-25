const path = require("path");
const express = require("express");
const userRouter = require("./routes/useRouter");
const hostRouter = require("./routes/hostRouter");
const errorController = require("./controllers/errorController");

const app = express();

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Global Middlewares (Always parse body & serve static files FIRST)
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public'))); 

// 3. Routing
app.use(userRouter);
app.use("/host", hostRouter);

// 4. Error Handling (Must be last)
app.use(errorController.get404);

// Export the fully configured express app
module.exports = app;
