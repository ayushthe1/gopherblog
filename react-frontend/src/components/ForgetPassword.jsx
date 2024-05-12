import React, { useState } from 'react';
import axios from 'axios';

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/forget-pw', { email });

      if (response.status === 200) {
        setMessage('Your password reset link was sent to your email. Please check that. You can close this tab now.');
      } else if (response.status === 400) {
        setMessage('Email does not exist. Please try again.');
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error('An error occurred in REACT Forget password:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgetPasswordForm;
