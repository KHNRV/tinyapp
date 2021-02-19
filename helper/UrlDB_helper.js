const { generateRandomString } = require("./helper");

class UrlDB {
  constructor(baseDB) {
    // Add baseDB values to this instance
    for (const shortURL in baseDB) {
      this[shortURL] = baseDB[shortURL];
    }
  }

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

  deleteLink(linkID, userID) {
    // If user is authorized, delete the link
    if (this[linkID].userID === userID) {
      delete this[linkID];
      return true;
    }
    return false;
  }

  modifyLink(linkID, longURL, userID) {
    // If user is authorized, modifyt the link
    if (this[linkID].userID === userID) {
      this[linkID].longURL = longURL.trim();
      return true;
    }
    return false;
  }
  getLongUrl(linkID) {
    if (this[linkID]) {
      return this[linkID].longURL;
    } else {
      return null;
    }
  }
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
