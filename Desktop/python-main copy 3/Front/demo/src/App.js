import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Signup from './Signup';
import Home from "./Home";
import ClassesPage from './ClassesPage';
import ClassDetailPage from './ClassDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/class" element={<ClassDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
