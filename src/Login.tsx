import React, { useState } from "react";
import { useMyContext } from "./MyContext";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const {
    username,
    password,
    setUsername,
    setPassword,
    setError,
    setCustomerId,
  } = useMyContext();
  const navigate = useNavigate();

  const [error, setLocalError] = useState<string | null>(null);

  const [loading, setLoading] = useState<Boolean>(false);

  const handleLogin = async () => {
    try {
      // Perform input validation if needed

      // Clear previous error
      setLocalError(null);
      setLoading(true);
      // Make the login request
      const response = await fetch(
        "https://book-island-backend.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: username,
            customer_password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Login successful

        setLoading(false);
        console.log("Login successful:", data);

        if (data.message) {
          toast.success(data.message, {
            position: "top-right",
            autoClose: 3000, // Set the duration for the notification to be visible (in milliseconds)
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          // or display the message in your UI, redirect, etc.
        }

        // Set the customer ID in the state
        if (data.user && data.user.customer_id) {
          setCustomerId(data.user.customer_id);
        }

        // You can redirect or perform any actions for a successful login

        setTimeout(() => {
          navigate("/home");
        }, 1000);
        // You can redirect or perform any actions for a successful login
      } else {
        // Login failed
        setLocalError(data.error);
        setError(data.error); // Assuming setError is a function in your context to handle error state
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle other errors if needed
      setLocalError("Internal Server Error");
    }
  };

  return (
    <div className="container mx-auto md:max-w-md lg:max-w-xl 2xl:mt-40 md:mt-20 mt-[10rem] p-6 bg-white rounded-md shadow-md">
      {loading && <Spinner />}

      <h2 className="text-2xl font-semibold mb-4">Login Form</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Username:
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Password:
        </label>
        <input
          type="password"
          className="w-full p-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600 transition duration-300"
        onClick={handleLogin}
      >
        Login
      </button>

      <div
        className="text-center mt-3 text-red-400 cursor-pointer "
        onClick={() => navigate("/")}
      >
        Click me to Register
      </div>
    </div>
  );
};

export default Login;
