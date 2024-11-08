import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainPage.css';

/**
 * Početna stranica
 * @returns prikaz početne stranice
 */
const MainPage: React.FC = () => {
    return (
        <div className="main-page-container">
            <h1>OTVORENO RAČUNARSTVO 2.lab</h1>
            <div className="centered-container">
                <Link to="/data-table" className='link'>Go to Data Table</Link>
            </div>
        </div>
    );
};

export default MainPage;
