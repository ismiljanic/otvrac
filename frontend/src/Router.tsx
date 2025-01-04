import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DataTable from './pages/Datatable';
import ClubDetails from './pages/ClubDetails';
import PlayerDetails from './pages/PlayerDetails';
import LeagueStandings from './pages/LeagueStandings';
import AddNewClub from './pages/AddNewClub';

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/data-table" element={<DataTable />} />
      <Route path="/clubs/:id" element={<ClubDetails />} />
      <Route path="/players/:id" element={<PlayerDetails />} />
      <Route path="/league-standings" element={<LeagueStandings />} />
      <Route path="/add-club" element={<AddNewClub />} />
    </Routes>
  );
};
