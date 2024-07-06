import React, { useState } from "react";
import axios from "axios";
import { useSnackbar } from "react-simple-snackbar";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const options = {
    position: "bottom-right",
    style: {
      backgroundColor: "gray",
      border: "2px solid lightgreen",
      color: "white",
      fontFamily: "Menlo, monospace",
      fontSize: "20px",
      textAlign: "center",
    },
    closeStyle: {
      color: "lightcoral",
      fontSize: "16px",
    },
  };
  const [openSnackbar, closeSnackbar] = useSnackbar(options);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://api.ayushsharma.co.in/api/forget-pw", {
        email,
      });

      if (response.status === 200) {
        setMessage(
          "Your password reset link was sent to your email. Please check that. You can close this tab now."
        );
      } else if (response.status === 400) {
        setMessage("Email does not exist. Please try again.");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("An error occurred in REACT Forget password:", error);
      setMessage("Some unknown error occured")
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <div className="mb-4">
          <label
            className="block text-lg text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Enter your email address:
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-r hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
      {message && <p className="text-center text-gray-600">{message}</p>}
    </div>
  );
};

export default ForgetPasswordForm;
