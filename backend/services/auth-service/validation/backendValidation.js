const validator = require("validator");

const registerInputValidation = (req, res, next) => {
  const { email, username, password } = req.body;

  // Sanitization of the email (acceptet format: alphanumeric@alphanumeric.alphanumeric)
  //TODO: look for "_","-" or other characteres
  const ignoreChars = "@."; // characters to be ignored
  const sanitizedEmail = email.replace(new RegExp(`[${ignoreChars}]`, "g"), "");
  if (!validator.isAlphanumeric(sanitizedEmail)) {
    return res.status(200).json({ error: "Invalid email" });
  }
  // Invalid email format
  else if (!validator.isEmail(email)) {
    return res.status(200).json({ error: "Invalid email" });
  }

  // Username must be at least 3 charactes long
  else if (username.length < 3) {
    return res
      .status(200)
      .json({ error: "Username must be at least 3 characters long" });
  }
  // Username contains non alphanumeric characters
  else if (!validator.isAlphanumeric(username)) {
    return res
      .status(200)
      .json({ error: "Username can contain only letters and numbers" });
  }

  // Password must be at least 8 charactes long:
  else if (password.length < 8) {
    return res
      .status(200)
      .json({ error: "Password must be at least 8 characters long" });
  } else if (password.length > 200) {
    return res
      .status(200)
      .json({ error: "Password must be at least 8 characters long" });
  }

  next();
};

const loginInputValidation = (req, res, next) => {
  const { username, password } = req.body;

  // Username contains non alphanumeric characters
  if (!validator.isAlphanumeric(username)) {
    return res
      .status(200)
      .json({ error: "Username can contain only letters and numbers" });
  }

  // Password must be at least 8 charactes long:
  else if (password.length < 8) {
    return res
      .status(200)
      .json({ error: "Password must be at least 8 characters long" });
  }

  next();
};

const changePasswordValidation = (req, res, next) => {
  const { username, password } = req.body;
  console.log("LOGIN");

  const { oldPassword, newPassword } = req.body;

  //TODO: Trim the new password

  // Password must be at least 8 charactes long:
  if (oldPassword.length < 8 || newPassword.length < 8) {
    return res
      .status(200)
      .json({ error: "Password must be at least 8 characters long" });
  }

  next();
};

module.exports.registerInputValidation = registerInputValidation;
module.exports.loginInputValidation = loginInputValidation;
module.exports.changePasswordValidation = changePasswordValidation;
