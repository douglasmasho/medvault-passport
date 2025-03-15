import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./sass/main.scss";
import { DarkModeProvider } from "./contexts/darkModeContext/index.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/authContext/index.jsx";
import UserProvider from "./contexts/userContext/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
);
