import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import useAuthStore from './store/authStore';

function App() {
  const { initAuth } = useAuthStore();
  
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
