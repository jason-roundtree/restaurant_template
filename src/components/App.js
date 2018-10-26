import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import NavBar from './NavBar';
import { connect } from 'react-redux';
// import Menu from './Menu'

export const App = () => {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Router />
        
      </div>
    </BrowserRouter>
  );
}

export default App;


