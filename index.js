require("dotenv").config();
const express = require("express");
const app = require("./app");
const cors = require("cors");
const ejs = require("ejs");

const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// base URL
app.get("/", (req, res) => {
  res.render("index");
});

// register get

app.get("/register", (req, res) => {
  res.render("register");
});

// register POST
app.post("/register", (req, res) => {
  try {
    res.status(201).send("user is created");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// login GET

app.get("/login", (req, res) => {
  res.render("login");
});

// login POST

app.post("/login", (req, res) => {
  try {
    res.status(200).send("Login in Succesfull");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Profile protected route
app.get("/profile", (req, res) => {
  res.render("profile");
});

// logout route
app.get("/logout", (req, res) => {
  res.redirect("/");
});
app.listen(PORT, () => {
  console.log(`Server is Running at http://localhost:${PORT}`);
});
