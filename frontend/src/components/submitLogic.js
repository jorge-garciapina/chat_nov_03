import {
  registerInputValidation,
  loginInputValidation,
} from "../validation/frontendValidation";

export const submitLogin = (
  event,
  username,
  password,
  loginUser,
  setAlertMessage,
  setShowAlert
) => {
  event.preventDefault();

  // Frontend validation
  if (!loginInputValidation(username, password)) {
    setAlertMessage("Invalid username or password");
    setShowAlert(true);
    return;
  }

  // Apollo Mutation Request
  loginUser({
    variables: {
      username: username,
      password: password,
    },
  }).catch(() => {
    // Promise rejection handled here
  });
};

export const submitRegister = (
  event,
  email,
  username,
  password,
  confirmPassword,
  registerUser,
  setValidationError
) => {
  event.preventDefault();

  const { isValid, error } = registerInputValidation(email, username, password);

  if (!isValid) {
    console.error(error);
    setValidationError(error);
    return;
  }

  if (password !== confirmPassword) {
    console.error("Passwords do not match!");
    setValidationError("Passwords do not match!");
    return;
  }

  registerUser({
    variables: {
      email,
      username,
      password,
    },
  }).catch((error) => {
    if (error.graphQLErrors.length > 0) {
      setValidationError(error.graphQLErrors[0].message);
    } else if (error.networkError) {
      setValidationError("Network error. Please try again later.");
    } else {
      setValidationError("An unexpected error occurred.");
    }
  });
};
