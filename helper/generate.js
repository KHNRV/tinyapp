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

module.exports = { generateRandomString };
