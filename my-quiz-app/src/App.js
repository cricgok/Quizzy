import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Review from './components/Review';
import GlobalStyle from './components/GlobalStyle';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [isLoggedIn, user]);

  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              isLoggedIn={isLoggedIn} 
              handleLogout={handleLogout} 
              user={user}
            />
          } 
        />
        <Route 
          path="/quiz/:tableName" 
          element={
            <Quiz 
              user={user}
              setUser={setUser}
            />
          } 
        />
        <Route 
          path="/results" 
          element={
          <Results user={user} />} 
        />
        <Route 
          path="/review" 
          element={
            <Review />
          } 
        />
        <Route 
          path="/login" 
          element={
            <Login 
              setIsLoggedIn={setIsLoggedIn} 
              setUser={setUser} 
            />
          } 
        />
        <Route 
          path="/register" 
          element={
            <Register 
            />
          } 
        />
        <Route 
          path="/profile" 
          element={
            <Profile 
              user={user} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
