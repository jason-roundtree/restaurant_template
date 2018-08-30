import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar';

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );
}

export default App;
