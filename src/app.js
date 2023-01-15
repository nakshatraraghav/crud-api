const express = require("express");
const mongoose = require("mongoose");
const path = require("node:path");
require("dotenv").config();

const users = require("./routes/users");

const port = process.env.PORT;
const database_url = process.env.DATABASE_URL;

const app = express();
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(
  database_url,
  () => {
    console.log("connected to database");
  },
  (error) => {
    console.log(error.message);
  }
);

app.get("/", (_, res) => {
  res.status(302).redirect("/api");
});

app.get("/api", (_, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/api/users", users);

app.listen(port, () => {
  console.log(`server started on port: ${port}`);
});
