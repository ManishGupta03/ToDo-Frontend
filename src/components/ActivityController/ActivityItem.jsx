import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import Timer from '../TimerController/Timer';
import { useNavigate } from 'react-router-dom';


const ActivityItem = ({ index, activity, fetchActivities }) => {
  const [currentActivity, setCurrentActivity] = useState(activity);
  const [showDetails, setShowDetails] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();


 
  const updateActivity = async (action) => {
    console.log(currentActivity);
    try {
      const res = await axios.put(`https://server-6601.onrender.com/activity/${currentActivity._id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentActivity(res.data);
      fetchActivities(); // Fetch activities again to update the list
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async () => {
    try {
      const updatedName = prompt('Enter new name:', currentActivity.name);
      if (updatedName) {
        await axios.put(`https://server-6601.onrender.com/activity/${currentActivity._id}`, { name: updatedName }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchActivities(); // Refresh the list
        navigate(0);
         }
    } catch (error) {
      console.error(error);
    }
  };


  const deleteActivity = async () => {
    try {
      await axios.delete(`https://server-6601.onrender.com/activity/delete/${currentActivity._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchActivities(); // Refresh the list
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowDetails = () => {
    setShowDetails(true);
    // Navigate to another route or component using React Router
    navigate(`/activity/${currentActivity._id}`); // Example route, adjust as per your application
  };

  return (
    <tr>
      <td className='text-center'>{index + 1}</td>
      <td className='text-center w-[170px]'>{currentActivity.name}</td>
      <td className='text-center w-[150px]'>
        {currentActivity.status === 'Ongoing' ? (
          <Timer startTime={currentActivity.startTime} duration={currentActivity.duration} />
        ) : (
          new Date(currentActivity.duration * 1000).toISOString().substr(11, 8)
        )}
      </td>
      <td className='text-center w-[150px]'>
      
        {currentActivity.status === 'Pending' && <button onClick={() => updateActivity('start')} className="btn btn-primary mr-1 bg-blue-500 hover:bg-blue-700 text-center">Start</button>}
        {currentActivity.status === 'Ongoing' && <button onClick={() => updateActivity('pause')} className="btn btn-warning mr-1 bg-yellow-400 hover:bg-yellow-600 mb-[5px] text-center">Pause</button>}
        {currentActivity.status === 'Paused' && <button onClick={() => updateActivity('resume')} className="btn btn-success mr-1 bg-gray-500 hover:bg-gray-700 text-center">Resume</button>}
        {currentActivity.status === 'Ongoing' && <button onClick={() => updateActivity('end')} className="btn btn-danger mr-1 bg-red-500 hover:bg-red-700 text-center">End</button>}
        {currentActivity.status === 'Completed' && <button onClick={ handleShowDetails} className="btn btn-info mr-1 bg-green-500 hover:bg-green-600 text-center">Show Details</button>}
       
        </td>
      <td className='text-center'>{currentActivity.status}</td>
      <td> <button onClick={updateTask} className="btn btn-warning mr-1 bg-orange-400 hover:bg-orange-600 mb-[5px] text-center ">Update</button> </td>
      <td><button onClick={deleteActivity} className="btn btn-danger mr-1 bg-red-500 hover:bg-red-700 text-center">Delete</button> </td>
    </tr>
  );
};

export default ActivityItem;
