import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CommentSection = ({ blogId, commenterName }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();
  const fetchComments = () => {
    axios
      .get(`https://api.ayushsharma.co.in/api/comments/${id}`)
      .then((response) => {
        console.log('fetch comments response:', response)
        setComments(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  useEffect(() => {
    fetchComments();
  }, [newComment]);

  const postComment = () => {
    if (!newComment) return;
    const requestBody = {
        blogid: blogId.toString(),
        commentername: commenterName.toString(),
        desc: newComment,
      };
    axios
      .post(`https://api.ayushsharma.co.in/api/comments/`, requestBody,{
        withCredentials: true,
      })
      .then((response) => {
        console.log("Post comment response :",response)
        fetchComments();
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
      });
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-4 rounded-lg shadow">
            <p className="text-gray-800 font-semibold">{comment.commentername}</p>
            <p className="text-gray-800">{comment.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
          placeholder="Write your comment..."
          rows="4"
        ></textarea>
        <button
          onClick={postComment}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 focus:outline-none"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default CommentSection;