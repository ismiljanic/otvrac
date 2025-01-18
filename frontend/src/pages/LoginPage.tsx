import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
    const { loginWithRedirect } = useAuth0();
    const navigate = useNavigate();

    const handleLogin = async () => {
        await loginWithRedirect();
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">OTVORENO RAČUNARSTVO</h1>
                <button onClick={handleLogin} className="login-button">
                    Log in
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
