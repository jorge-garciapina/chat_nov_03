// Importing necessary libraries and modules
const express = require("express"); // Express is a minimal and flexible Node.js web application framework
const { ApolloServer, execute, subscribe } = require("apollo-server-express"); // ApolloServer is a community-driven, open-source GraphQL server
const http = require("http"); // HTTP module for creating an HTTP server
const ws = require("ws"); // ws is a simple to use, blazing fast, and thoroughly tested WebSocket client and server implementation
const { useServer } = require("graphql-ws/lib/use/ws"); // useServer is a function from graphql-ws that sets up the WebSocket server for GraphQL subscriptions
const { makeExecutableSchema } = require("@graphql-tools/schema"); // Function to create a GraphQL schema from type definitions and resolvers
const { merge } = require("lodash"); // Utility library for performing operations like merging objects
const { mergeTypeDefs } = require("@graphql-tools/merge"); // Function to merge multiple type definitions into one

// Importing Schemas, Resolvers, and DataSources
// These components define the GraphQL API structure, implementation, and how to fetch data from different sources.
const authSchemas = require("./graphql/schemas/authSchemas.js");
const authResolvers = require("./graphql/resolvers/authResolvers.js");
const AuthService = require("./graphql/dataSources/authAPI.js");

const userSchemas = require("./graphql/schemas/userSchemas.js");
const userResolvers = require("./graphql/resolvers/userResolvers.js");
const UserService = require("./graphql/dataSources/userAPI.js");

const conversationSchemas = require("./graphql/schemas/conversationSchemas.js");
const conversationResolvers = require("./graphql/resolvers/conversationResolvers.js");
const ConversationService = require("./graphql/dataSources/conversationAPI.js");

// Import new Subscription related files
const subscriptionSchemas = require("./graphql/schemas/subscriptionSchemas.js");
const subscriptionResolvers = require("./graphql/resolvers/subscriptionResolvers.js");
/////////////////////////////
// Creating an Executable Schema
// The schema is the cornerstone of any GraphQL API.
// Now includes SubscriptionSchemas and SubscriptionResolvers
const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([
    authSchemas,
    userSchemas,
    conversationSchemas,
    subscriptionSchemas,
  ]),

  resolvers: merge(
    authResolvers,
    userResolvers,
    conversationResolvers,
    subscriptionResolvers
  ),
});

// Initializing ApolloServer
// Now includes SubscriptionService in dataSources
const server = new ApolloServer({
  schema,
  context: ({ req, connection }) => {
    // For WebSocket subscriptions, the context is different, so we check if it exists.
    // If it does, it means it’s a WebSocket connection, and we extract the context from there.
    if (connection) {
      return connection.context;
    } else {
      const token = req.headers.authorization || "";
      return { token };
    }
  },
  dataSources: () => {
    return {
      authAPI: new AuthService(),
      userAPI: new UserService(),
      conversationAPI: new ConversationService(),
      // subscriptionAPI: new SubscriptionService(), // Adding the new SubscriptionService
    };
  },
  formatError: (err) => {
    return { message: err.message };
  },
});
////////////////////////////////
const startServer = async () => {
  // Starting the Server
  // This function initializes and starts both the HTTP and WebSocket servers.
  const app = express(); // Creating an instance of the Express application
  await server.start(); // Starting the Apollo Server
  server.applyMiddleware({ app, path: "/graphql" }); // Applying middleware to handle GraphQL requests

  // Creating an HTTP Server
  // The HTTP server handles HTTP requests and is the foundation upon which the WebSocket server runs.
  const httpServer = http.createServer(app); // Creating an HTTP server with the Express app

  // Creating a WebSocket Server
  // The WebSocket server runs on top of the HTTP server and handles GraphQL subscriptions.
  const wsServer = new ws.Server({
    server: httpServer, // Associating the WebSocket server with the HTTP server
    path: "/graphql", // Specifying the path for WebSocket connections
  });

  // Enabling GraphQL Subscriptions through WebSocket
  // The `useServer` function sets up the WebSocket server for GraphQL subscriptions and defines
  // connection and disconnection event handlers.
  useServer(
    {
      schema,
      execute,
      subscribe,
      onConnect: (ctx) => console.log("Connected:", ctx), // Logging connection events
      onDisconnect: (ctx) => console.log("Disconnected:", ctx), // Logging disconnection events
    },
    wsServer
  );

  // Starting the HTTP and WebSocket Servers
  // The servers are started on a specified port, and a message is logged to indicate that the servers are ready.
  const port = 4000;
  httpServer.listen(
    { port: port },
    () =>
      console.log(
        `Server ready at http://localhost:${port}${server.graphqlPath}`
      ) // Logging the server ready message
  );
};

// Invoking the startServer function to start the server
startServer();
