// Router.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Register from "./Register";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
