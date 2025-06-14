import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './home';
import Contact from './contact';
import About from './about';
import Support from './support';
import Policy from './policy';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/support" element={<Support />} />
      <Route path="/policy" element={<Policy />} />
    </Routes>
  );
};

export default App;