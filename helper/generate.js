/**
 * This function outputs a random string of 6 characters composed of numbers and mixed cased alphabetical characters.
 * @returns Random string of six characters
 */
const generateRandomString = () => {
  // Define string of all the possible character to be used to generate the
  // unique short URL ID
  const characterSet =
    "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
  // Define an empty string
  let result = "";
  // Push a random character from the characterSet to the array
  while (result.length < 6) {
    result +=
      characterSet[Math.floor(Math.random() * (characterSet.length - 1))];
  }

  // return the result array as a string
  return result;
};

/**
 * This function output whether if a given email exist already in a given
 * database of users
 * @param {string} email
 * @param {object} users
 * @return {boolean}
 */
const isEmailDuplicate = (email, users) => {
  // make users db an array
  const usersArr = Object.values(users);
  // check if the email exist
  for (const user of usersArr) {
    console.log("user.email:", user.email);
    if (email === user.email) {
      // if yes, return true
      return true;
    }
    // if no, return false
  }
  return false;
};

module.exports = { generateRandomString, isEmailDuplicate };
