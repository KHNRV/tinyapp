const { UserDB } = require("../helper/UserDB_helper");

const users = new UserDB({
  "kevin.nicolas": {
    id: "kevin.nicolas",
    email: "kevin.nicolas@hey.com",
    password: "$2b$10$Q1/q8EYpM2Pc/iWoFHhIZeYGN3tEo0jjMoI5DmC/vV/VRtI2CG9iC", // "qwerty"
  },
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$9cK.XUp22emckDHB7e.TOOR6pLYX2/UtqUhhUmykgG87NRTTrBrcK", // "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$OAvD6SNjojM4xFEZqsnC3uwrqgzPMY9WnmfusSaFcnrCHgPXLN196", // "dishwasher-funk"
  },
});

module.exports = { users };
