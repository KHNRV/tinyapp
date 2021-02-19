// Import libraries and modules
const express = require("express");
const bodyParser = require("body-parser");
const { users } = require("./db/users");
const { urlDatabase } = require("./db/urls");
const { error } = require("./db/error");
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
/**
 *
 * HOME ROUTE
 *
 */
app.get("/", (req, res) => {
  res.redirect("/urls");
});

/**
 *
 * USER AUTHENTIFICATION ROUTES
 *
 */

// ./register >> User registration page (GET) and registration submission (POST)
app
  .route("/register")
  .get((req, res) => {
    const templateVars = { user: users[req.session.user_id] };
    res.render("register", templateVars);
  })
  .post((req, res) => {
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

// ./login >> User login page (GET) and login submission (POST)
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

// ./logout >> Logging out user by clearing cookie
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

/**
 *
 * URL ROUTES
 *
 */

// ./urls >> List all of users redirections if logged in
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

// ./urls/new >> New redirection form
app.get("/urls/new", (req, res) => {
  if (users[req.session.user_id]) {
    const templateVars = { user: users[req.session.user_id] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// ./urls/:shortURL >> See  the state (GET) or modify the reidirection (POST)
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
    res.redirect(`/urls`);
  });

// ./urls/:shortURL/delete >> Delete a redirection (POST)
app.post("/urls/:shortURL/delete", (req, res) => {
  urlDatabase.deleteLink(req.params["shortURL"], req.session.user_id);
  res.redirect("/urls");
  console.log(`Entry ${req.params.shortURL} deleted.`); // Log the POST request body to the console
});

// ./urls.json >> public API giving access to url redirection database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// ./u/:shortURL >> redirecting to longURL as instructed by the urlDatabase
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase.getLongUrl(req.params.shortURL);
  // Check if URL exists in DB
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).end();
  }
});

// ./:any >> redirect to 404 Error page
app.get("/:any", (req, res) => {
  const templateVars = {
    error: error["404"],
    user: users[req.session.user_id],
  };
  res.status(404).render("error", templateVars);
});
