// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="w-full min-h-screen bg-[#090b0e] text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Các route khác như /product/:id sẽ thêm ở đây */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;