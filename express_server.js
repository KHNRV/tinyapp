// Import libraries and modules
const express = require("express");
const bodyParser = require("body-parser");
const { users } = require("./db/users");
const { urlDatabase } = require("./db/urls");
const cookieSession = require("cookie-session");

// Configure Express
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 8080; // default port 8080
app.listen(PORT, () => {
  console.log(`TinyURL is listening on port ${PORT}!`);
});
app.use(
  cookieSession({
    name: "session",
    keys: ["8sedLL65XkQpHAA6ksCPcHfJHhpELjGsxi7?S$hy"],
  })
);

// URLS ROUTES
app
  .route("/urls")
  .get((req, res) => {
    if (users[req.session.user_id]) {
      const templateVars = {
        urls: urlDatabase.getUrlsForUser(req.session.user_id),
        user: users[req.session.user_id],
      };
      res.render("urls_index", templateVars);
    } else {
      res.redirect("/login");
    }
  })
  .post((req, res) => {
    const shortURL = urlDatabase.addLink(
      req.body["longURL"],
      req.session.user_id
    );
    res.redirect(`urls/${shortURL}`);
  });

// Delete a redirection
app.post("/urls/:shortURL/delete", (req, res) => {
  urlDatabase.deleteLink(req.params["shortURL"], req.session.user_id);
  res.redirect("/urls");
  console.log(`Entry ${req.params.shortURL} deleted.`); // Log the POST request body to the console
});

app
  .route("/urls/:shortURL")
  .get((req, res) => {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id],
    };
    res.render("urls_show", templateVars);
  }) // Update redirection
  .post((req, res) => {
    urlDatabase.modifyLink(
      req.params["shortURL"],
      req.body["newURL"],
      req.session.user_id
    );
    res.redirect(`/urls/${req.params["shortURL"]}`);
  });

app.get("/urls/new", (req, res) => {
  if (users[req.session.user_id]) {
    const templateVars = { user: users[req.session.user_id] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase.getLongUrl(req.params.shortURL);
  // Check if URL exists in DB
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).end();
  }
});

app
  .route("/login")
  .get((req, res) => {
    const templateVars = { user: users[req.session.user_id] };
    res.render("login", templateVars);
  })
  .post((req, res) => {
    const matchingUserID = users.loginCheck(req.body);
    if (matchingUserID) {
      req.session.user_id = matchingUserID;
      res.redirect("/urls");
    } else {
      res.status(403).end("403");
    }
  });

// Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Registration
app.post("/register", (req, res) => {
  console.log(req.body);
  console.log(users);
  const newUser = users.register(req.body);
  if (newUser) {
    req.session.user_id = newUser.id;
    res.redirect("/urls");
  } else {
    res.status(400).end("400");
  }
});

// GET ROUTING
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render("register", templateVars);
});
