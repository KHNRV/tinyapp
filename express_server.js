// import the express library
const express = require("express");
const app = express();

// import bodyParser library
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// configure the server port
const PORT = 8080; // default port 8080

// set the view engine to ejs
app.set("view engine", "ejs");

/**
 * This function outputs a random string of 6 characters composed of numbers and mixed cased alphabetical characters.
 * @returns Random string of six characters
 */
const generateRandomString = () => {
  // Define string of all the possible character to be used to generate the
  // unique short URL ID
  const characterSet =
    "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
  // Define an empty string
  let result = "";
  // Push a random character from the characterSet to the array
  while (result.length < 6) {
    result +=
      characterSet[Math.floor(Math.random() * (characterSet.length - 1))];
  }

  // return the result array as a string
  return result;
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Print in the console when the server is running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
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
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
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
