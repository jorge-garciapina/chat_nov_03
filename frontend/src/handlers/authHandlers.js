export const handleLogin = async (loginUser, username, password) => {
  try {
    await loginUser({
      variables: {
        username,
        password,
      },
    });
  } catch (err) {
    // Error handling can be enhanced further depending on the application's requirements.
    console.error("Error while logging in:", err);
  }
};

export const handleRegister = async (
  registerFunction,
  email,
  username,
  password,
  avatar
) => {
  try {
    await registerFunction({
      variables: { email, username, password, avatar },
    });
    // Handle any logic after successful registration here. Perhaps redirection or showing a success message.
  } catch (error) {
    console.error("Error registering user:", error);
    // Handle registration errors, like showing an error message to the user.
  }
};
