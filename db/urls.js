const { generateRandomString } = require("../helper/generate");

class UrlDB {
  constructor() {
    // Test entries
    this.b6UTxQ = { longURL: "https://www.tsn.ca", userID: "kevin.nicolas" };
    this.i3BoGr = { longURL: "https://www.google.ca", userID: "aJ48lW" };
  }

  addLink(longURL, userID) {
    // Define newShortURL
    let newShortURL = "";
    // Generate a unique newShortURL
    do {
      newShortURL = generateRandomString();
    } while (this[newShortURL]);
    // add the redirection to the db
    this[newShortURL] = { longURL, userID };
    // return  newTinyURL object
    console.log(this[newShortURL]);
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
      this[linkID].longURL = longURL;
      return true;
    }
    return false;
  }
  getLongUrl(linkID) {
    return this[linkID].longURL;
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

const urlDatabase = new UrlDB();

module.exports = { urlDatabase };
