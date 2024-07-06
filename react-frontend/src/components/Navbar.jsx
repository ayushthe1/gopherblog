// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// const Navbar = () => {
//   const [loading, setLoading] = useState(false);
//   const [userData, setUserData] = useState();
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };
//   const navigate = useNavigate();
//   const logOut = () => {
//     axios
//       .post(
//         `http://localhost:3000/api/logout`,
//         {},
//         {
//           withCredentials: true,
//         }
//       )
//       .then(function (response) {
//         // handle success
//         setLoading(false);
//         //   setMessage(response?.data?.message);
//         //   openSnackbar(response?.data?.message);
//         localStorage.removeItem("user");
//         // Set cookie expiration date to a time in the past
//         document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         window.location.reload(true); // hard refresh

//         navigate("/");
//       })
//       .catch(function (error) {
//         // handle error
//         setLoading(false);
//         //   setMessage(error?.response?.data?.message);
//         //   openSnackbar(error?.response?.data?.message);
//         //console.log(error?.response?.data?.message);
//       })
//       .then(function () {
//         localStorage.removeItem("user");
//         localStorage.removeItem("jwt");
//         document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         window.location.reload(true);
//         navigate("/");
//       });
//   };
//   useEffect(() => {
//     const User = localStorage.getItem("user");
//     const parseUser = JSON.parse(User);
//     setUserData(User);
//   }, [userData]);
//   return (
//     <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="flex items-center">
//           <svg
//             className="fill-current h-8 w-8 mr-2 text-white"
//             width="54"
//             height="54"
//             viewBox="0 0 54 54"
//             xmlns="https://www.svgrepo.com/show/373635/go-gopher.svg"
//           >
//             <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
//           </svg>
//           <span className="font-semibold text-xl tracking-tight text-white">
//             Gopher Blog
//           </span>
//         </div>

//         <div className="flex items-center">
//           <div className={`sm:flex ${isOpen ? "block" : "hidden"}`}>
//             <Link
//               to="/"
//               className="text-base text-white hover:text-gray-200 mr-4"
//             >
//               Home
//             </Link>
//             <Link
//               to="/create"
//               className="text-base text-white hover:text-gray-200 mr-4"
//             >
//               Create Post
//             </Link>
//             {!userData && (
//               <Link
//                 to="/register"
//                 className="text-base text-white hover:text-gray-200 mr-4"
//               >
//                 Register
//               </Link>
//             )}
//             <Link
//               to="/personal"
//               className="text-base text-white hover:text-gray-200 mr-4"
//             >
//               My Post
//             </Link>
//           </div>
//           <div>
//             {userData ? (
//               <div
//                 onClick={logOut}
//                 className="text-base text-white hover:text-gray-200 cursor-pointer mr-4"
//               >
//                 Log Out
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="text-base text-white hover:text-gray-200 cursor-pointer mr-4"
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//           <button
//             className="block sm:hidden text-white hover:text-gray-200"
//             onClick={toggleMenu}
//           >
//             {/* Hamburger Icon */}
//             <svg
//               className="h-6 w-6 fill-current"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M3 9h14a1 1 0 110 2H3a1 1 0 110-2zm0-4h14a1 1 0 110 2H3a1 1 0 110-2zm0 8h14a1 1 0 110 2H3a1 1 0 110-2z" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
        const User = localStorage.getItem("user");
        const parseUser = JSON.parse(User);
        setUserData(User);
      }, [userData]);

      const logOut = () => {
            axios
              .post(
                `http://localhost:3000/api/logout`,
                {},
                {
                  withCredentials: true,
                }
              )
              .then(function (response) {
                // handle success
                setLoading(false);
                //   setMessage(response?.data?.message);
                //   openSnackbar(response?.data?.message);
                localStorage.removeItem("user");
                // Set cookie expiration date to a time in the past
                document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.reload(true); // hard refresh
        
                navigate("/");
              })
              .catch(function (error) {
                // handle error
                setLoading(false);
                //   setMessage(error?.response?.data?.message);
                //   openSnackbar(error?.response?.data?.message);
                console.log(error?.response?.data?.message);
              })
              .then(function () {
                localStorage.removeItem("user");
                localStorage.removeItem("jwt");
                document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.reload(true);
                navigate("/");
              });
          };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <svg
            className="fill-current h-8 w-8 mr-2 text-white"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="https://www.svgrepo.com/show/373635/go-gopher.svg"
          >
            <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
          </svg>
          <span className="font-semibold text-xl tracking-tight text-white">
            Gopher Blog
          </span>
        </div>

        <div className="flex items-center">
          <button
            className="block sm:hidden text-white hover:text-gray-200"
            onClick={toggleMenu}
          >
            {/* Hamburger Icon */}
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 9h14a1 1 0 110 2H3a1 1 0 110-2zm0-4h14a1 1 0 110 2H3a1 1 0 110-2zm0 8h14a1 1 0 110 2H3a1 1 0 110-2z" />
            </svg>
          </button>

          <div
            className={`${
              isOpen ? "block" : "hidden"
            } sm:flex sm:items-center`}
          >
            <Link
              to="/"
              className="text-base text-white hover:text-gray-200 mr-4 block sm:inline-block"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-base text-white hover:text-gray-200 mr-4 block sm:inline-block"
            >
              Create Post
            </Link>
            <Link
              to="/register"
              className="text-base text-white hover:text-gray-200 mr-4 block sm:inline-block"
            >
              Register
            </Link>
            <Link
              to="/personal"
              className="text-base text-white hover:text-gray-200 mr-4 block sm:inline-block"
            >
              My Post
            </Link>
            <div>
             {userData ? (
              <div
                onClick={logOut}
                className="text-base text-white hover:text-gray-200 block sm:inline-block"
              >
                Log Out
              </div>
            ) : (
              <Link
                to="/login"
                className="text-base text-white hover:text-gray-200 block sm:inline-block"
              >
                Login
              </Link>
            )}
          </div>
            {/* <Link
              to="/login"
              className="text-base text-white hover:text-gray-200 block sm:inline-block"
            >
              Login
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
