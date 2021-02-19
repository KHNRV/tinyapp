const { generateRandomString } = require("../helper/helper");
const bcrypt = require("bcrypt");

class UserDB {
  constructor(baseDB) {
    // Add baseDB values to this instance
    for (const user in baseDB) {
      this[user] = baseDB[user];
    }
  }
  register(user) {
    // Is entry valid ?
    if (!user.email || !user.password) {
      return null;
    }

    // Is email already used
    if (this.getByEmail(user.email, this)) {
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
    const userID = this.getByEmail(credentials.email, this);
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
  getByEmail(email) {
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
  isUser(userID) {
    if (this[userID]) {
      return true;
    } else {
      return false;
    }
  }

  getByCookie(req) {
    const userID = req.session.user_id;
    if (this.isUser(userID)) {
      return userID;
    }
    return null;
  }
}

module.exports = { UserDB };
