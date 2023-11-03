import gql from "graphql-tag";

export const LOGIN_MUTATION = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterUser(
    $email: String!
    $username: String!
    $password: String!
    $avatar: String
  ) {
    registerUser(
      email: $email
      username: $username
      password: $password
      avatar: $avatar
    ) {
      token
      message
    }
  }
`;

export const LOGOUT_USER_MUTATION = gql`
  mutation LogoutUser($token: String!) {
    logoutUser(token: $token) {
      token
      message
    }
  }
`;

export const STATUS_BASED_ON_VIEW = gql`
  mutation UpdateStatusBasedOnView($token: String!, $location: String!) {
    updateStatusBasedOnView(token: $token, location: $location) {
      status
    }
  }
`;
