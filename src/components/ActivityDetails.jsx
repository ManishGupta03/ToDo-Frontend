import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const ActivityDetails = () => {
  const [activity, setActivity] = useState(null);
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`https://server-6601.onrender.com/activity/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivity(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivity();
  }, [id, token]);

  if (!activity) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Activity Details</h2>
        <div className="mb-6">
          <p className="text-lg"><strong>Name:</strong> {activity.name}</p>
          <p className="text-lg"><strong>Status:</strong> {activity.status}</p>
          <p className="text-lg"><strong>Start Time:</strong> {new Date(activity.startTime).toLocaleString()}</p>
          <p className="text-lg"><strong>End Time:</strong> {new Date(activity.endTime).toLocaleString()}</p>
          <p className="text-lg"><strong>Duration:</strong> {new Date(activity.duration * 1000).toISOString().substr(11, 8)}</p>
        </div>
        <h3 className="text-xl font-semibold mb-2">History</h3>
        <ul className="list-disc pl-5">
          {activity.history.map((entry, index) => (
            <li key={index} className="text-lg">
              <strong>{entry.action}:</strong> {new Date(entry.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;

