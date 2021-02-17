const { generateRandomString } = require("../helper/generate");

const users = {
  register: function(user) {
    // Define newID
    let newID;
    // Generate a ID that does not exist in the db
    do {
      newID = generateRandomString();
    } while (Object.keys(this).includes(newID));
    // Get the user details
    const { email, password } = user;
    // Register the user in the db under newID
    this[newID] = { id: newID, email, password };
    // Return new user
    return this[newID];
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
