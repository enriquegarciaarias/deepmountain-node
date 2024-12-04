import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewSwitcher from './components/ViewSwitcher'; // Use ViewSwitcher instead of App
import DatasetJson from './components/DatasetJson';
import About from './components/About';
import Home from './components/Home';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ViewSwitcher />} /> {/* Default view-switching logic */}
      <Route path="/datasetJson" element={<DatasetJson />} />
      <Route path="/about" element={<About />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
);

export default AppRoutes;