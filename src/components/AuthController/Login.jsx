import { useState, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import your CSS file for custom styles

const Login = () => {
  const [loginId, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://server-6601.onrender.com/auth/login', { loginId, password });
     
      login(res.data.data);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  const handleRegister = async (e)=>{
    e.preventDefault();
    navigate('/register')
  }
 
  return (
    <div className="login-container p-[20px]">
      <form onSubmit={handleSubmit} className="login-form w-[30vw] h-[25vw] ">
        <h2 className='font-bold text-2xl'>Login</h2>
        <div className="form-group">
          <label className='font-bold text-0.9xl'>Email/Username</label>
          <input 
            type="text" 
            value={loginId} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email" 
            required 
          />
        </div>
        <div className="form-group">
          <label className='font-bold text-0.9xl'>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}  
            placeholder="Enter your password" 
            required 
          />
        </div>
        <button type="submit" className='bg-blue-500 h-[50px] mt-[30px] font-bold text-1.5xl text-white'>Login</button>
        <p className='font-bold ml-[350px] cursor-pointer text-blue-600 ' onClick={handleRegister}>Register</p>
      </form>
     
    </div>
  );
};

export default Login;
