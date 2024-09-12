import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Principal from './pagines/Principal';
import Joc from './pagines/Joc';
import Clau from './pagines/Clau';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Clau />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/joc" element={<Joc />} />
      </Routes>
    </Router>
  );
}

export default App;