const { generateRandomString } = require("../helper/helper");
const bcrypt = require("bcrypt");

class UserDB {
  constructor() {
    this["kevin.nicolas"] = {
      id: "kevin.nicolas",
      email: "kevin.nicolas@hey.com",
      password: "$2b$10$Q1/q8EYpM2Pc/iWoFHhIZeYGN3tEo0jjMoI5DmC/vV/VRtI2CG9iC", // "qwerty"
    };
    this.userRandomID = {
      id: "userRandomID",
      email: "user@example.com",
      password: "$2b$10$9cK.XUp22emckDHB7e.TOOR6pLYX2/UtqUhhUmykgG87NRTTrBrcK", // "purple-monkey-dinosaur"
    };
    this.user2RandomID = {
      id: "user2RandomID",
      email: "user2@example.com",
      password: "$2b$10$OAvD6SNjojM4xFEZqsnC3uwrqgzPMY9WnmfusSaFcnrCHgPXLN196", // "dishwasher-funk"
    };
  }
  register(user) {
    // Is entry valid ?
    if (!user.email || !user.password) {
      return null;
    }

    // Is email already used
    if (this.getUserByEmail(user.email, this)) {
      return null;
    }

    // Define newID
    let newID;
    // Generate a ID that does not exist in the db
    do {
      newID = generateRandomString();
    } while (this[newID]);
    // Get the user details
    const { email } = user;
    const password = bcrypt.hashSync(user.password, 10);
    // Register the user in the db under newID
    this[newID] = { id: newID, email, password };
    // Return new user
    return this[newID];
  }
  loginCheck(credentials) {
    // Test if the email exists
    const userID = this.getUserByEmail(credentials.email, this);
    if (userID) {
      // Test if the associated password match the user input
      if (bcrypt.compareSync(credentials.password, this[userID].password)) {
        // Return userID if match
        return userID;
      }
    }
    // Return "" otherwise
    return "";
  }
  /**
   * This function output whether if a given email exist already in a given
   * database of users
   * @param {string} email
   * @param {object} users
   * @return {string} - if match, return user id. Else, false
   */
  getUserByEmail(email) {
    // make users db an array
    const usersArr = Object.values(this);
    // check if the email exist
    for (const user of usersArr) {
      console.log("user.email:", user.email);
      if (email === user.email) {
        // if yes, return user id
        return user.id;
      }
      // if no, return false
    }
    return "";
  }
}

module.exports = { UserDB };
