// src/Router.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DataTable from './pages/Datatable';

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/data-table" element={<DataTable />} />
    </Routes>
  );
};
