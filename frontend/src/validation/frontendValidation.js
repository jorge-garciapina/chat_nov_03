const validator = require("validator");

const loginInputValidation = (username, password) => {
  if (!validator.isAlphanumeric(username)) {
    return {
      isValid: false,
      error: "Username can contain only letters and numbers",
    };
  }
  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }
  return { isValid: true };
};

const registerInputValidation = (email, username, password) => {
  const ignoreChars = "@.";
  const sanitizedEmail = email.replace(new RegExp(`[${ignoreChars}]`, "g"), "");

  if (!validator.isAlphanumeric(sanitizedEmail)) {
    return { isValid: false, error: "Invalid email" };
  } else if (!validator.isEmail(email)) {
    return { isValid: false, error: "Invalid email format" };
  } else if (username.length < 3) {
    return {
      isValid: false,
      error: "Username must be at least 3 characters long",
    };
  } else if (!validator.isAlphanumeric(username)) {
    return {
      isValid: false,
      error: "Username can contain only letters and numbers",
    };
  } else if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }
  return { isValid: true };
};

export { loginInputValidation, registerInputValidation };
