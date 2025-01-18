import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/MainPage.css';
import { Link, useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
    const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
    const [isLoggedInApp, setIsLoggedInApp] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedInApp(loggedIn);
    }, []);

    const handleLogin = async () => {
        await loginWithRedirect();
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedInApp(true);
    };

    const handleLogout = () => {
        localStorage.setItem('isLoggedIn', 'false');
        setIsLoggedInApp(false);
        navigate('/login');
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main-page-container">
            <h1>OTVORENO RAČUNARSTVO</h1>

            {!isLoggedInApp ? (
                <button onClick={handleLogin} className="login-button">
                    Login
                </button>
            ) : (
                <>
                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Logout
                    </button>

                    <Link to="/data-table" className='link'>Go to Data Table</Link>

                    <div className="download-links">
                        <ul>
                            <li>
                                <a href="http://localhost:8080/download_csv" download>
                                    Refresh (CSV)
                                </a>
                            </li>
                            <li>
                                <a href="http://localhost:8080/download_json" download>
                                    Refresh (JSON)
                                </a>
                            </li>
                            <li>
                                {isAuthenticated && (
                                    <Link to="/profile">Go TO YOUR PROFILE</Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default MainPage;
