// Import libraries and modules
const express = require("express");
const bodyParser = require("body-parser");
const { users } = require("./db/users");
const { urlDatabase } = require("./db/urls");
const { error } = require("./helper/error");
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
  if (users[req.session.user_id]) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
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
    const userID = req.session.user_id;
    if (users.isUser(userID)) {
      res.redirect("/urls");
    } else {
      const templateVars = { user: users[userID] };
      res.render("register", templateVars);
    }
  })
  .post((req, res) => {
    console.log(req.body);
    console.log(users);
    const newUser = users.register(req.body);
    if (newUser) {
      req.session.user_id = newUser.id;
      res.redirect("/urls");
    } else {
      error.render("duplicateUser", res);
    }
  });

// ./login >> User login page (GET) and login submission (POST)
app
  .route("/login")
  .get((req, res) => {
    const userID = req.session.user_id;
    if (users.isUser(userID)) {
      res.redirect("/urls");
    } else {
      const templateVars = { user: users[userID] };
      res.render("login", templateVars);
    }
  })
  .post((req, res) => {
    const matchingUserID = users.loginCheck(req.body);
    if (matchingUserID) {
      req.session.user_id = matchingUserID;
      res.redirect("/urls");
    } else {
      error.render("wrongCredentials", res);
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
      error.render(401, res);
    }
  })
  .post((req, res) => {
    if (users.getByCookie(req)) {
      const shortURL = urlDatabase.addLink(
        req.body["longURL"],
        req.session.user_id
      );
      res.redirect(`urls/${shortURL}`);
    } else {
      error.render(401, res);
    }
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
    const userID = req.session.user_id;
    const shortURL = req.params.shortURL;

    // if user is connected and owner of that link
    if (urlDatabase.getUrlsForUser(userID)[shortURL]) {
      const templateVars = {
        shortURL,
        longURL: urlDatabase.getLongUrl(shortURL),
        user: users[userID],
      };
      res.render("urls_show", templateVars);
      // if user is connected but do not own that link
    } else if (users[userID] && urlDatabase.getLongUrl(shortURL)) {
      error.render(403, res);
      // if link exists but user is not connected
    } else if (urlDatabase.getLongUrl(shortURL)) {
      error.render(401, res);
      // if link does not exist
    } else {
      error.render(404, res);
    }
  }) // Update redirection
  .post((req, res) => {
    const userID = req.session.user_id;
    const shortURL = req.params.shortURL;
    const newURL = req.body["newURL"];
    // if user is logged in and owns the URL for the given ID
    if (urlDatabase.getUrlsForUser(userID)[shortURL]) {
      urlDatabase.modifyLink(shortURL, newURL, userID);
      res.redirect(`/urls`);
      // if user is logged in but does not own the URL for the given ID
    } else if (users.isUser(userID)) {
      error.render(403, res);
    } else {
      // if user is not logged in
      error.render(401, res);
    }
  });

// ./urls/:shortURL/delete >> Delete a redirection (POST)
app.post("/urls/:shortURL/delete", (req, res) => {
  // if user is logged in and owns the URL for the given ID
  if (urlDatabase.getUrlsForUser(userID)[shortURL]) {
    urlDatabase.deleteLink(req.params["shortURL"], req.session.user_id);
    res.redirect("/urls");
    console.log(`Entry ${req.params.shortURL} deleted.`); // Log the POST request body to the console
    // if user is logged in but does not own the URL for the given ID
  } else if (users.isUser(userID)) {
    error.render(403, res);
  } else {
    // if user is not logged in
    error.render(401, res);
  }
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
    error.render(404, res);
  }
});

// ./:any >> redirect to 404 Error page
app.get("/:any", (req, res) => {
  error.render(404, res);
});
