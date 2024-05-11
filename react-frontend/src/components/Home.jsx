import React, { useEffect, useState } from "react";
import "./Home.css";

import BlogPost from "./BlogPost";
const Home = () => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const User = localStorage.getItem("user");
    const parseUser = JSON.parse(User);
    setUserData(parseUser);
  }, []);

  return (
    <>
      <div className="relative h-screen bg-slate-200 w-full flex items-center justify-center text-center bg-white">
        <main className="px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center text-purple-800">
            <h2 className="text-4xl tracking-tight leading-10 font-medium sm:text-5xl sm:leading-none md:text-6xl">
              <span className="text-purple-600 font-bold">
                Hi {userData?.first_name} {userData?.last_name} ,
              </span>{" "}
              Discover the world of Go !
            </h2>
            <p className="mt-3 sm:mt-5 sm:text-md sm:max-w-xl sm:mx-auto md:mt-5"></p>
      
            <div className="mt-5 sm:mt-8 sm:flex justify-center">
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a
                  href="#allblogs"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-regular rounded-md text-purple-500 bg-white hover:text-purple-600 hover:bg-purple-100 focus:outline-none focus:shadow-outline-purple focus:border-purple-600 transition duration-150 ease-in-out md:py-4 md:px-10"
                >
                  View All Posts
                </a>
              </div>
              <div className="rounded-md shadow">
                <a
                  href="/create"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-regular rounded-md text-white bg-purple-500 hover:bg-purple-400 focus:outline-none focus:border-purple-600 focus:shadow-outline-purple transition duration-150 ease-in-out md:py-4 md:px-10"
                >
                  Create Post
                </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a
                  href="/personal"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-regular rounded-md text-purple-500 bg-white hover:text-purple-600 hover:bg-purple-100 focus:outline-none focus:shadow-outline-purple focus:border-purple-600 transition duration-150 ease-in-out md:py-4 md:px-10"
                >
                  View Your Posts
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div id="allblogs">
        <BlogPost />
      </div>
    </>
  );
};

export default Home;
