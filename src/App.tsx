import React from "react";
import "./App.css";
import Login from "./Login";
import Home from "./Home";
import { useMyContext } from "./MyContext"; // Import useMyContext

const App: React.FC = () => {
  const { isLoggedIn } = useMyContext(); // Access isLoggedIn from the context

  return <div>{isLoggedIn ? <Home /> : <Login />}</div>;
};

export default App;
