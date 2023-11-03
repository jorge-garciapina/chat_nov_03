import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/dashboard/Dashboard";
import { initializeLanguage } from "./translations/languageUtils";

import { Provider } from "react-redux";
import store from "./redux/store"; // Path to the store file

function App() {
  React.useEffect(() => {
    initializeLanguage();
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />{" "}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
