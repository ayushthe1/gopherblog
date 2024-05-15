import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSnackbar } from "react-simple-snackbar";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
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
  const [openSnackbar] = useSnackbar(options);
  const onSubmit = (data) => {
    setLoading(true);
    const body = {
      ...data,
      //phone: parseInt(data.phone),
    };
    axios
      .post(`https://api.ayushsharma.co.in/api/register`, { ...body })
      .then(function (response) {
        // handle success
        setLoading(false);
        console.log("RESPONSE :",response)
        localStorage.setItem("user", JSON.stringify(response?.data?.user));

        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";


        const jwt = response.data.cookie;
        console.log("LOGGING JWT")
        console.log("JWT :" ,jwt)

        const domain = ".ayushsharma.co.in"
        document.cookie = `jwt=${JSON.stringify(jwt.value)}; SameSite=Strict; path=/; domain=${domain}`;

        setMessage(response?.data?.message);
        openSnackbar(response?.data?.message);
        
        console.log("Setting in local storage n signup" ,response?.data?.message);
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

    //console.log(data);
  };
  return (
    <div className="bg-slate-200 min-h-screen flex justify-center items-center">
      <div className="bg-white w-96 border border-gray-200 rounded-md p-8">
        <h1 className="text-center text-[#0c2650] text-2xl font-bold mb-4">
          Sign up
        </h1>
        {message && (
          <div className="bg-gradient-to-r from-fuchsia-400 via-sky-400 to-violet-200 text-white font-bold rounded p-2 mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm mb-1">First Name:</label>
            <input
              type="text"
              name="first_name"
              className="w-full px-3 py-2 border-b-2 text-sm rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your First Name"
              autoComplete="on"
              {...register("first_name", { required: true })}
            />
            {errors.first_name && (
              <span className="text-red-600 text-[10px] italic">
                First Name is required
              </span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Last Name:</label>
            <input
              type="text"
              name="last_name"
              className="w-full px-3 py-2 border-b-2 text-sm rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your Last Name"
              autoComplete="on"
              {...register("last_name", { required: true })}
            />
            {errors.last_name && (
              <span className="text-red-600 text-[10px] italic">
                Last Name is required
              </span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email:</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border-b-2 text-sm rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your Email Address"
              autoComplete="on"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-red-600 text-[10px] italic">
                Email is required
              </span>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Password:</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 border-b-2 text-sm rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your Password"
              autoComplete="on"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-red-600 text-[10px] italic">
                Password is required
              </span>
            )}
          </div>
          {/* <div className="mb-4">
            <label className="block text-sm mb-1">Phone No:</label>
            <input
              type="text"
              name="phone"
              className="w-full px-3 py-2 border-b-2 text-sm rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your Phone Number"
              autoComplete="on"
              {...register("phone", { required: true })}
            />
            {errors.phone && (
              <span className="text-red-600 text-[10px] italic">
                Phone No is required
              </span>
            )}
          </div> */}
          <button
            className={`w-full mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
//   return (
//     <div className="bg-gradient-to-r min-h-screen lg:min-h-screen  from-cyan-500 to-blue-500">
//       <div className="flex justify-center py-10 ">
//         <div className="bg-white w-96 h-auto border border-gray-200 rounded-md">
//           <h1 className="text-center pt-4 text-[#0c2650] text-lg font-bold">
//             Sign up
//           </h1>
//           {message && (
//             <div className="px-11 py-4">
//               <div className="font-bold bg-gradient-to-r from-fuchsia-400 via-sky-400 to-violet-200 p-4  text-center text-white ">
//                 {message}
//               </div>
//             </div>
//           )}

//           <div className="pl-8">
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="text-sm">First Name</div>
//               <div class="relative text-gray-600 focus-within:text-gray-400">
//                 <span class="absolute inset-y-0 left-0 flex items-center pl-2">
//                   <svg
//                     fill="none"
//                     stroke="currentColor"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     viewBox="0 0 24 24"
//                     className="w-4 h-4"
//                   >
//                     <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                   </svg>
//                 </span>
//                 <input
//                   type="text"
//                   name="first_name"
//                   class="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
//                   placeholder="Enter your first name"
//                   autoComplete="on"
//                   {...register("first_name", {
//                     required: true,
//                   })}
//                 />
//                 <div>
//                   {errors.first_name && errors.first_name.type === "required" && (
//                     <span
//                       role="alert"
//                       className="text-red-600 text-[10px] italic"
//                     >
//                       First Name is required
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="pt-6 text-sm">Last Name:</div>
//               <div class="relative text-gray-600 focus-within:text-gray-400">
//                 <span class="absolute inset-y-0 left-0 flex items-center pl-2">
//                   <button
//                     type="submit"
//                     class="p-1 focus:outline-none focus:shadow-outline"
//                   >
//                     <svg
//                       fill="none"
//                       stroke="currentColor"
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       stroke-width="2"
//                       viewBox="0 0 24 24"
//                       className="w-4 h-4"
//                     >
//                       <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                     </svg>
//                   </button>
//                 </span>
//                 <input
//                   type="text"
//                   name="last_name"
//                   className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
//                   placeholder="Enter your last name"
//                   autoComplete="on"
//                   {...register("last_name", {
//                     required: true,
//                   })}
//                 />
//                 <div>
//                   {errors.last_name && errors.last_name.type === "required" && (
//                     <span
//                       role="alert"
//                       className="text-red-600 text-[10px] italic"
//                     >
//                       Last Name is required
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="pt-6 text-sm">Email:</div>
//               <div className="relative text-gray-600 focus-within:text-gray-400">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//                   <button
//                     type="submit"
//                     className="p-1 focus:outline-none focus:shadow-outline"
//                   >
//                     <svg
//                       fill="none"
//                       stroke="currentColor"
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       stroke-width="2"
//                       viewBox="0 0 24 24"
//                       className="w-4 h-4"
//                     >
//                       <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                     </svg>
//                   </button>
//                 </span>
//                 <input
//                   type="email"
//                   name="email"
//                   className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
//                   placeholder="Enter your Email Address"
//                   autoComplete="on"
//                   {...register("email", {
//                     required: true,
//                   })}
//                 />
//                 <div>
//                   {errors.email && errors.email.type === "required" && (
//                     <span
//                       role="alert"
//                       className="text-red-600 text-[10px] italic"
//                     >
//                       Email is required
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="pt-6 text-sm">Password:</div>
//               <div className="relative text-gray-600 focus-within:text-gray-400">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//                   <button
//                     type="submit"
//                     className="p-1 focus:outline-none focus:shadow-outline"
//                   >
//                     <svg
//                       fill="none"
//                       stroke="currentColor"
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       stroke-width="2"
//                       viewBox="0 0 24 24"
//                       class="w-4 h-4"
//                     >
//                       <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                     </svg>
//                   </button>
//                 </span>
//                 <input
//                   type="password"
//                   name="password"
//                   className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
//                   placeholder="Enter your password"
//                   autoComplete="on"
//                   {...register("password", {
//                     required: true,
//                   })}
//                 />
//                 <div>
//                   {errors.password && errors.password.type === "required" && (
//                     <span
//                       role="alert"
//                       className="text-red-600 text-[10px] italic"
//                     >
//                       Password is required
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="pt-6 text-sm">Phone No:</div>
//               <div className="relative text-gray-600 focus-within:text-gray-400">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//                   <button
//                     type="submit"
//                     className="p-1 focus:outline-none focus:shadow-outline"
//                   >
//                     <svg
//                       fill="none"
//                       stroke="currentColor"
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       stroke-width="2"
//                       viewBox="0 0 24 24"
//                       className="w-4 h-4"
//                     >
//                       <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                     </svg>
//                   </button>
//                 </span>
//                 <input
//                   type="number"
//                   name="phone"
//                   className="py-2 border-b-2 text-sm rounded-md pl-10 focus:outline-none w-10/12 focus:bg-white focus:text-gray-900"
//                   placeholder="Enter your phone number"
//                   autoComplete="on"
//                   {...register("phone", {
//                     required: true,
//                   })}
//                 />
//                 <div>
//                   {errors.phone && errors.phone.type === "required" && (
//                     <span
//                       role="alert"
//                       className="text-red-600 text-[10px] italic"
//                     >
//                       Phone No is required
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="py-6 px-6">
//                 <button
//                   className={`w-full ${
//                     loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700 "
//                   } text-white font-bold py-2 px-4 rounded`}
//                   disabled={loading ? true : false}
//                 >
//                   {loading ? "Loading..." : "Sign up"}
//                 </button>
//                 <div className="text-center text-sm pt-1">
//                   Already have an account? <Link to="login">Login</Link>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
