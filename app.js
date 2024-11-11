require("dotenv").config();
const express = require("express");

const cors = require("cors");
const ejs = require("ejs");
const app = express();
require("./config/database");
require("./config/passport");

const User = require("./models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.set("view engine", "ejs");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// express-session

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),

    // cookie: { secure: true }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// base URL
app.get("/", (req, res) => {
  res.render("index");
});
// register get

app.get("/register", (req, res) => {
  res.render("register");
});

// register POST
app.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send("User is Already Exits in Database");

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) return res.status(500).send("Error hashing password");

      const newUser = new User({
        username: req.body.username,
        password: hash,
      });
      newUser.save();
      res.status(201).redirect("/login");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const checkedLoggedIn=(req,res,next)=>{
  if(req.isAuthenticated()){
   return res.redirect("/profile")
  }
  next()
}
// login GET

app.get("/login",checkedLoggedIn,(req, res) => {
  res.render("login");
});

// login POST

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  })
);

// Profile protected route
app.get("/profile", (req, res) => {
  try {
    if (req.isAuthenticated()) {
     return res.render("profile");
    }
  } catch (error) {
   return res.render("login");
  }
});

// logout route
app.get("/logout", (req, res) => {
  try {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = app;
