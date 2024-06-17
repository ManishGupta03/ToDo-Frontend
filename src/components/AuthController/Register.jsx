import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://server-6601.onrender.com/auth/register', { username, email, password, name });
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signup-container flex flex-col items-center justify-center mt-[100px]">
      <form onSubmit={handleSubmit} className="signup-form w-[35vw] border-1 border-black shadow-lg p-[30px] rounded-lg">
        <h2 className="text-2xl mb-4 text-center font-bold text-2xl">Signup</h2>
        <div className="form-group mb-4">
          <label className="block mb-1 font-bold">Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name" 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-1 font-bold">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Choose a username" 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-1 font-bold">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email" 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-1 font-bold">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}  
            placeholder="Choose a password" 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-600">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
