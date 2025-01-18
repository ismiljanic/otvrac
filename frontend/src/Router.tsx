import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import MainPage from './pages/MainPage';
import DataTable from './pages/Datatable';
import ClubDetails from './pages/ClubDetails';
import PlayerDetails from './pages/PlayerDetails';
import ProfilePage from './pages/ProfilePage';
import LeagueStandings from './pages/LeagueStandings';
import AddNewClub from './pages/AddNewClub';
import LoginPage from './pages/LoginPage';

export const Router: React.FC = () => {
    const { isAuthenticated } = useAuth0();

    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/data-table" element={<DataTable />} />
            <Route path="/clubs/:id" element={<ClubDetails />} />
            <Route path="/players/:id" element={<PlayerDetails />} />
            <Route path="/league-standings" element={<LeagueStandings />} />
            <Route path="/add-club" element={<AddNewClub />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
                path="/profile" 
                element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
            />
        </Routes>
    );
};
