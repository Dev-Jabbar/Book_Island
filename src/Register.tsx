import axios, { AxiosError } from "axios";
import { useMyContext } from "./MyContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const {
    username,
    password,
    setUsername,
    setPassword,

    error,
    setError,
  } = useMyContext();

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "https://book-island-backend.onrender.com/api/register",
        {
          customer_name: username,
          customer_password: password,
        }
      );

      console.log("Registration successful", response.data);
      // Check for the presence of a message in the response
      if (response.data && response.data.message) {
        toast.success(response.data.message, {
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

      setTimeout(() => {
        navigate("/Login");
      }, 1000);
      // Handle success, e.g., redirect to login page
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          // Handle error response
          const errorMessage = (axiosError.response.data as any)?.error;

          // Check for specific error messages

          if (
            errorMessage &&
            errorMessage.includes("Customer with this name already exists")
          ) {
            setError("Customer with this name already exists");
          } else {
            setError("Failed to register customer");
          }
        } else {
          // Handle other errors
          setError("Network error");
        }
      } else {
        // Handle other non-Axios errors
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="container mx-auto md:max-w-md lg:max-w-xl 2xl:mt-40 md:mt-20 mt-[10rem] p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Register Form</h2>
      {/* Display error message if present */}
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
        onClick={handleRegister}
      >
        Register
      </button>
      <div
        className="text-center mt-3 text-red-400 cursor-pointer"
        onClick={() => navigate("/login")}
      >
        Proceed to Login
      </div>
    </div>
  );
};

export default Register;
