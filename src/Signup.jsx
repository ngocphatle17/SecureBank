import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import React from 'react';


const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    axios.post('/api/signup', { username, email, password })
      .then(result => {
        console.log(result);
        navigate('/signin');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
