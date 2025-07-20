import React from 'react';
import UserSignUp from './pages/Users/UserSignUp';
import './App.css';
import UserLogin from './pages/Users/UserLogin';
import ProductPage from './pages/ProductPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Institute/Login';
import SignUp from './pages/Institute/SignUp';
import Course from './pages/course';
import AddCoursePage from './pages/Institute/AddCoursePage';
import AI from './pages/Ai';
import VoiceTestPage from './form';
import MyCourses from './pages/Mycourses';
function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Signup' element={<SignUp />} />
        <Route path='/UserSignUp' element={<UserSignUp />} />
        <Route path='/UserLogin' element={<UserLogin />} />
        <Route path='/Course' element={<Course />} />
        <Route path='/Main' element={<ProductPage />} />
        <Route path='/AddCourse' element={<AddCoursePage />} />
        <Route path='/Voice' element={< VoiceTestPage />} />
        <Route path="/MyCourses" element={<MyCourses />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;