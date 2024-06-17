import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import ActivityItem from './ActivityController/ActivityItem';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get('https://server-6601.onrender.com/activity/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
         setActivities(res.data); 
      } else {
        console.error('API response is not as expected:', res.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request data:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
    }
  };

  const addActivity = async () => {
    try {
      await axios.post('https://server-6601.onrender.com/activity/add', { name: newActivity }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewActivity('');
      fetchActivities(); // Refresh the list
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = () =>{
    navigate('/login');
  }

  const handleLogout = () =>{
    logout();
    navigate(0);
    try{
      const res = axios.post('https://server-6601.onrender.com/auth/logout', {});
      console.log(res);
      navigate('/login')
    }
    catch(error){
      console.log(error);
    }

  }
  

  return (
    <div className="container mt-5">
      <h1 className="text-center font-bold text-3xl">To-Do Activity List</h1>
      <div className='flex justify-end mb-4'>
        {token ? (
          <button onClick={handleLogout} className="btn btn-danger mr-1 bg-red-500 hover:bg-red-600 w-[120px] font-bold h-[40px]">Logout</button>
        ) : (
          <button onClick={handleLogin} className="btn btn-danger mr-1 bg-blue-500 hover:bg-blue-600 w-[120px] font-bold h-[40px]">Login</button>
        )}
      </div>
      {token && (
      <div className="input-group mb-3">
        <input type="text" value={newActivity} onChange={(e) => setNewActivity(e.target.value)} className="form-control" placeholder="New Activity" />
        <div className="input-group-append">
          <button onClick={addActivity} className="btn btn-primary hover:bg-blue-600">Add</button>
        </div>
      </div>)}
      <table className="table table-bordered ">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Activity Name</th>
            <th>Activity Duration</th>
            <th>Actions</th>
            <th>Status</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(activities) && activities.map((activity, index) => (
            <ActivityItem key={activity._id} index={index} activity={activity} fetchActivities={fetchActivities} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
