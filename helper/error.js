const { users } = require("../db/users");
const error = {
  render: function(code, res) {
    const templateVars = {
      error: this[code],
    };
    res.status(this[code].code).render("error", templateVars);
  },
  400: {
    code: 400,
    message: "You're such a bad request...",
    description: "I could not understand what you asked me",
    solutionLink: "/",
    solutionMessage: "Start again?",
  },
  401: {
    code: 401,
    message: "Ehh... Do I know you?",
    description:
      "I'd be glad to give you acces to that page, but maybe tell me who you are first.",
    solutionLink: "/login",
    solutionMessage: "Login",
  },
  403: {
    code: 403,
    message: "WOW, stop right there!",
    description:
      "It looks like you have no business trying to access that page",
    solutionLink: "/",
    solutionMessage: "Please move along",
  },
  404: {
    code: 404,
    message: "Well, that sucks...",
    description:
      "I cannot find what you are asking for. Although, I do have an amazing 4K 60FPS video that explains what happend!",
    solutionLink: "https://youtu.be/2ocykBzWDiM",
    solutionMessage: "Watch 404 Explained",
  },
  duplicateUser: {
    code: 400,
    message: "I guess you have a twin.",
    description:
      "This email is already know by our agency. Please do not attempt identity theft",
    solutionLink: "/register",
    solutionMessage: "Register (with another email address)",
  },
  wrongCredentials: {
    code: 403,
    message: "Mmmhhhh, not sure if it's really you...",
    description:
      "Your email and password combinaison does not match our super secured user database",
    solutionLink: "/login",
    solutionMessage: "Try again",
  },
};

module.exports = { error };
