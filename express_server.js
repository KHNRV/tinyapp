const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");

// Configure Express
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
app.use(cookieParser());

const { generateRandomString } = require("./helper/generate.js");

const { users } = require("./db/users");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Print in the console when the server is running
app.listen(PORT, () => {
  console.log(`TinyURL is listening on port ${PORT}!`);
});

// POST ROUTING
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  console.log(req.body); // Log the POST request body to the console
  console.log("New short URL:", shortURL); // Log the new shortURL
  urlDatabase[shortURL] = req.body.longURL; // add the new entry to the db
  res.redirect(`urls/${shortURL}`);
});

// Delete a redirection
// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Login
app.post("/login", (req, res) => {
  console.log(req.body.username);
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

// Registration
app.post("/register", (req, res) => {
  console.log(req.body);
  console.log(users);
  const newUser = users.register(req.body);
  if (newUser) {
    res.cookie("user_id", newUser.id);
    res.redirect("/urls");
  } else {
    res.status(400).end("400");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
  console.log(`Entry ${req.params.shortURL} deleted.`); // Log the POST request body to the console
});

// Update redirection
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const newURL = req.body.newURL;
  urlDatabase[shortURL] = newURL;
  res.redirect(`/urls/${shortURL}`);
});

// GET ROUTING
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {};
  res.render("login", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  // Check if URL exists in DB
  if (Object.keys(urlDatabase).includes(shortURL)) {
    res.redirect(longURL);
  } else {
    res.status(404).end();
  }
});
