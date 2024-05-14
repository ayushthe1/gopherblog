import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const BlogPost = () => {
  const [blogData, setBlogData] = useState();
  const [loading, setLoading] = useState(false);
  const allBlog = () => {
    setLoading(true);
    axios
      .get(
        `https://api.ayushsharma.co.in/api/allpost`,
        //{},
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        setLoading(false);
        {console.log("HI 2", response.data.data)}
        setBlogData(response?.data?.data);
        console.log(response?.data?.data);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };
  useEffect(() => {
    allBlog();
  }, []);
  return (
    <>
      {loading && (
        <div className="text-2xl font-bold text-center px-56 pt-24">
          <h1>LOADING.....</h1>
        </div>
      )}
      <div className="container my-12 mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogData?.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg overflow-auto transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl hover:bg-purple-100"
              style={{
                boxShadow:
                  "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Link to={`/detail/${blog.id}`}>
                <img
                  alt="Placeholder"
                  className="h-72 w-full object-cover"
                  src={blog?.Image}
                />
              </Link>
              <div className="p-4">
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                  <Link
                    to={`/detail/${blog.id}`}
                    className="hover:text-indigo-600"
                  >
                    {blog.title}
                  </Link>
                </h1>
                <p className="text-sm text-gray-600">
                  {new Date(blog?.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100">
                <Link
                  to={`/detail/${blog.id}`}
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <img
                    alt="Placeholder"
                    className="block rounded-full w-5 h-5 mr-1"
                    src="../../logo.png"
                  />
                  <p className="text-sm">
                    {blog?.user?.first_name} {blog?.user?.last_name}
                  </p>
                </Link>
                <a
                  href="#"
                  className="text-gray-700 hover:text-red-600"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle like functionality
                  }}
                >
                  <span className="hidden">Like</span>
                  <i className="fa fa-heart"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogPost;
