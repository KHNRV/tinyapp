const { expect } = require("chai");

const { users } = require("../db/users");

const testUsers = {
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

describe("users.getByEmail", function() {
  it("should return a user with valid email", function() {
    const user = users.getByEmail("user@example.com");
    const expectedOutput = "userRandomID";
    expect(user).to.deep.equal(expectedOutput);
  });
  it("should return null", function() {
    const user = users.getByEmail("superunknownuser@example.com");
    expect(user).to.be.null;
  });
});
