const { UrlDB } = require("../helper/UrlDB_helper");

const urlDatabase = new UrlDB({
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "kevin.nicolas" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
});

module.exports = { urlDatabase };
