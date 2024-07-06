import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import RichTextEditor from "./RichTextEditor";

function decodeHTMLEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

const CommentSection = ({ blogId, commenterName }) => {
  const [comments, setComments] = useState([]);
  const [newCommentDesc, setNewCommentDesc] = useState("");
  const { id } = useParams();

  const fetchComments = () => {
    axios
      .get(`http://localhost:3000/api/comments/${id}`)
      .then((response) => {
        setComments(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const postComment = () => {
    if (!newCommentDesc) return;
    const requestBody = {
      blogid: blogId.toString(),
      commentername: commenterName.toString(),
      desc: newCommentDesc,
    };
    axios
      .post(`http://localhost:3000/api/comments/`, requestBody, {
        withCredentials: true,
      })
      .then((response) => {
        fetchComments();
        setNewCommentDesc("");
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
            <div
              className="text-gray-800 prose"
              dangerouslySetInnerHTML={{ __html: decodeHTMLEntities(comment.desc) }}
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <RichTextEditor value={newCommentDesc} onChange={setNewCommentDesc} />
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

