const generateRandomString = require("../helper/generate");

const urlDatabase = {
  addLink: function(longURL, userID) {
    // Define newShortURL
    let newShortURL = "";
    // Generate a unique newShortURL
    do {
      newShortURL = generateRandomString();
    } while (this.newShortURL);
    // add the redirection to the db
    this[newShortURL] = { longURL, userID };
    // return  newTinyURL object
    return this[newShortURL];
  },
  deleteLink: function(linkID, userID) {},
  modifyLink: function(linkID, longURL, userID) {},
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};

module.exports = { urlDatabase };
