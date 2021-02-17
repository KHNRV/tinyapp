const {
  generateRandomString,
  isEmailDuplicate,
} = require("../helper/generate");

const users = {
  register: function(user) {
    // Is entry valid ?
    if (!user.email || !user.password) {
      return null;
    }

    // Is email already used
    if (isEmailDuplicate(user.email, this)) {
      return null;
    }

    // Define newID
    let newID;
    // Generate a ID that does not exist in the db
    do {
      newID = generateRandomString();
    } while (this[newID]);
    // Get the user details
    const { email, password } = user;
    // Register the user in the db under newID
    this[newID] = { id: newID, email, password };
    // Return new user
    return this[newID];
  },
  loginCheck: function(credentials) {
    // Test if the email exists
    const userID = isEmailDuplicate(credentials.email, this);
    if (userID) {
      // Test if the associated password match the user input
      if (credentials.password === this[userID].password) {
        // Return userID if match
        return userID;
      }
    }
    // Return "" otherwise
    return "";
  },
  "kevin.nicolas": {
    id: "kevin.nicolas",
    email: "kevin.nicolas@hey.com",
    password: "qwerty",
  },
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

module.exports = { users };
