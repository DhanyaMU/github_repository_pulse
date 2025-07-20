import React from "react";
import { AuthProvider } from './contexts/AuthContext';
import Routes from "./Routes";
import "./styles/tailwind.css";
import "./styles/index.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes />
      </div>
    </AuthProvider>
  );
}

export default App;