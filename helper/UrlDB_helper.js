const { generateRandomString } = require("./helper");

class UrlDB {
  constructor(baseDB) {
    // Add baseDB values to this instance
    for (const shortURL in baseDB) {
      this[shortURL] = baseDB[shortURL];
    }
  }
  /**
   * This function adds a new redirection link to the database
   * @param {string} longURL
   * @param {string} userID
   */
  addLink(longURL, userID) {
    // Define newShortURL
    let newShortURL = "";
    // Generate a unique newShortURL
    do {
      newShortURL = generateRandomString();
    } while (this[newShortURL]);
    // add the redirection to the db
    const trimedLongURL = longURL.trim();
    this[newShortURL] = { trimedLongURL, userID };
    // return  newTinyURL object
    return newShortURL;
  }

  /**
   * This function deletes a user from the database
   * @param {string} linkID
   * @param {string} userID
   */
  deleteLink(linkID, userID) {
    // If user is authorized, delete the link
    if (this[linkID].userID === userID) {
      delete this[linkID];
      return true;
    }
    return false;
  }

  /**
   * This function modify a redirection in the database
   * @param {*} linkID
   * @param {*} longURL
   * @param {*} userID
   */
  modifyLink(linkID, longURL, userID) {
    // If user is authorized, modifyt the link
    if (this[linkID].userID === userID) {
      this[linkID].longURL = longURL.trim();
      return true;
    }
    return false;
  }
  /**
   * This function returns the longURL associated with a shortURL
   * @param {string} linkID
   */
  getLongUrl(linkID) {
    if (this[linkID]) {
      return this[linkID].longURL;
    } else {
      return null;
    }
  }
  /**
   * This function returns an object of all the redirection owned by a given
   * user
   * @param {*} userID
   */
  getUrlsForUser(userID) {
    // Define userLinks object
    const userLinks = {};

    // Iterate in this db
    for (const urlID in this) {
      if (this[urlID].userID === userID) {
        userLinks[urlID] = this[urlID];
      }
    }
    return userLinks;
  }
}

module.exports = { UrlDB };
