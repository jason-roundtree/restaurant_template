import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import NavBar from './NavBar';

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Router />
      </div>
    </BrowserRouter>
  );
}


