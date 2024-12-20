const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const schoolRoute = require("./routes/school");

dotenv.config();
const app = express();

const connectToMongo = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB");
};

connectToMongo();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/auth", authRoute);
app.use("/user/", userRoute);
app.use("/school/", schoolRoute);

app.listen(8000, () => {
  console.log("server is runing");
});
app.get("/health", (req, res) => {
  res.status(200).send("Server is running");
});
