import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const AllBlogPost = () => {
  const [blogData, setBlogData] = useState();
  const [loading, setLoading] = useState(false);
  const allBlog = () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:3000/api/allpost`,
        //{},
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        setLoading(false);
        
        setBlogData(response?.data?.data);
       
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
                    src="data:image/png;base64,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"
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

export default AllBlogPost;
