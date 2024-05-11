import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSnackbar } from "react-simple-snackbar";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
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
  const onSubmit = (data) => {
    setLoading(true);
    const body = {
      ...data,
      //phone: parseInt(data.phone),
    };
    axios
      .post(
        `http://localhost:3000/api/login`,
        { ...body },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        // handle success
        setLoading(false);
        setMessage(response?.data?.message);
        openSnackbar(response?.data?.message);
        localStorage.setItem("user", JSON.stringify(response?.data?.user));
        console.log("Setting in local storage in signin" ,response?.data?.message);

        const jwt = response.data.cookie;
        document.cookie = `jwt=${jwt}; SameSite=Strict; path=/;`;

        navigate("/");
        
      })
      .catch(function (error) {
        // handle error
        setLoading(false);
        setMessage(error?.response?.data?.message);
        openSnackbar(error?.response?.data?.message);
        //console.log(error?.response?.data?.message);
      })
      .then(function () {
        // always executed
      });

    console.log(data);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <div className="bg-white shadow-lg rounded-md p-8 w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 rounded border focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-red-500 text-xs italic">Email is required</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 rounded border focus:outline-none focus:border-indigo-500"
              placeholder="Enter your password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs italic">Password is required</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">Forgot Password?</Link>
            <button
              type="submit"
              className={`px-4 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-700">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};
export default Login;