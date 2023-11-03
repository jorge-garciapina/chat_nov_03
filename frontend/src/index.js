import React from "react";
import { createRoot } from "react-dom/client";

import { ApolloProvider } from "@apollo/client";
import client from "./graphql/apolloClient";
import App from "./App";

// Importing the i18next configuration
import "./translations/languageConfig";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
