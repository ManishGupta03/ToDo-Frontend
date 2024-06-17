import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/AuthController/Login'
import { AuthProvider } from './Context/AuthContext';
import Register from './components/AuthController/Register'
import Dashboard from '../src/components/Dashboard';
import ActivityDetails from './components/ActivityDetails';




function App() {


  return (
    <AuthProvider>
      <BrowserRouter>
    <Routes>
     <Route path="/" element={<Dashboard/>} />
     <Route path="/login" element={<Login/>} />
     <Route path="/register" element={<Register/>} />
     <Route path="/activity/:id" element={<ActivityDetails/>}/>
     <Route path="*" element={<Navigate to="/" />} />
   </Routes>
   </BrowserRouter>
   </AuthProvider>
  )
}

export default App
