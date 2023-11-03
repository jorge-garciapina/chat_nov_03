// Import the RESTDataSource module from the Apollo server's data source REST package.
const { RESTDataSource } = require("apollo-datasource-rest");

// Define the AuthService class, which will handle authentication-related operations.
class AuthService extends RESTDataSource {
  constructor() {
    super();
    // Setting the baseURL for the authentication service using environment variables.
    this.baseURL = process.env.AUTH_SERVICE_CONNECTION;
    // Alternate URLs for the authentication service (not currently in use).
    // this.baseURL = "http://auth-service:3001/auth";
    // this.baseURL = "http://127.0.0.1:57563/auth";
  }

  // Method to retrieve a list of all registered users.
  async getUsers() {
    return this.get("users");
  }

  // Method to register a new user with the provided email, username, and password.
  async registerUser({ email, username, password }) {
    const response = await this.post(`register`, { email, username, password });

    // Check and handle any potential error responses.
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  // Method to authenticate a user with their username and password.
  async loginUser({ username, password }) {
    let response;
    try {
      response = await this.post(`login`, { username, password });
    } catch (error) {
      // Log any potential errors during the login attempt.
      console.log(error);
    }

    // Check and handle any potential error responses.
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  // Method to log out a user using their authentication token.
  async logoutUser({ token }) {
    const response = await this.post(`logout`, { token });

    // Check and handle any potential error responses.
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  // Method to change a user's password using their authentication token and provided old and new passwords.
  async changePassword({ token, oldPassword, newPassword }) {
    const response = await this.post(`change-password`, {
      token,
      oldPassword,
      newPassword,
    });

    // Check and handle any potential error responses.
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  // Method to validate if a user operation is permissible using their authentication token.
  async validateUserOperation(token) {
    const response = await this.get(
      `validateUserOperation`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );

    // Check and handle any potential error responses.
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  // Method to validate if the provided receiver is a registered and legitimate user.
  async validateMessageReceiver(receiver) {
    const response = await this.get(`validateMessageReciever/${receiver}`);

    // Check and handle any potential error responses.
    if (response.error) {
      throw new Error(response.error);
    }

    return response;
  }
}

// Export the AuthService class for usage in other modules.
module.exports = AuthService;
