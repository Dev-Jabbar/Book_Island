import React from "react";
import { MyProvider, useMyContext } from "./MyContext";

const Login = () => {
  const {
    username,
    password,
    setUsername,
    setPassword,
    isLoggedIn,
    setLoggedIn,
  } = useMyContext();

  const handleLogin = () => {
    // Check if both username and password are not empty
    if (username.trim() !== "" && password.trim() !== "") {
      setLoggedIn(true);
    } else {
      // Display an error or take appropriate action if fields are empty
      alert("Please enter both username and password.");
    }
  };

  return (
    <div className="container mx-auto md:max-w-md lg:max-w-xl 2xl:mt-40 md:mt-20 mt-[10rem] p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Login Form</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Username:
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Password:
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600 transition duration-300"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
