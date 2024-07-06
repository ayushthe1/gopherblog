import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentSection from "./CommentSection";

const BlogDetail = () => {
  const navigate = useNavigate();
  const [singlePost, setSinglePost] = useState();
  const { id } = useParams();
  const [commenterName, setCommenterName] = useState("Anonymous");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      const name = `${parsedUser.first_name} ${parsedUser.last_name}`;
      setCommenterName(name);
      console.log("Updated commenterName :", name);
    } else {
      console.log("User is not signed in");
    }
  }, []);

  const singleBlog = () => {
    axios
      .get(`https://api.ayushsharma.co.in/api/allpost/${id}`, {
        withCredentials: true,
      })
      .then(function (response) {
        setSinglePost(response?.data?.data);
        console.log("BlogDetails from /allpost :", response?.data?.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    singleBlog();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-200">
      {singlePost && (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6" bg-slate-200>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{singlePost.title}</h1>
            <div className="flex items-center justify-between text-gray-600 mb-6">
              <p>Author: {singlePost.user.first_name} {singlePost.user.last_name}</p>
              <p>Published: {new Date(singlePost.created_at).toDateString()}</p>
            </div>
            <div className="relative mb-6">
              <img className="w-full h-64 object-cover rounded-lg" src={singlePost.Image} alt="Blog Cover" />
              <div className="absolute inset-0 bg-black opacity-25 rounded-lg"></div>
            </div>
            <div
              className="text-lg text-gray-800 leading-relaxed mb-6 prose"
              dangerouslySetInnerHTML={{ __html: singlePost.desc }}
            />
            <CommentSection blogId={singlePost.id} commenterName={commenterName} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
