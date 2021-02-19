const { users } = require("../db/users");
const error = {
  render: function(code, req, res) {
    const templateVars = {
      error: this[code.toString()],
      user: users[req.session.user_id],
    };
    res.status(code).render("error", templateVars);
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
};

module.exports = { error };
