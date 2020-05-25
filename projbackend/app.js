require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();

//My Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//This is my middlewers
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


//My Routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);






//This is DB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });


//Port
const port = 8000;

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
