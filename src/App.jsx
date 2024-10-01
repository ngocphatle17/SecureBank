import React from 'react'; 
import Header from './Header.jsx';
import Body from './Body.jsx'; 
import Footer from './Footer.jsx';
import Signin from './Signin.jsx'; 
import Signup from './Signup.jsx';
import Homepage from './homepage.jsx';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Body />} /> 
        <Route path="/app" element={<Homepage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
