import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';

const ProfilePage: React.FC = () => {
    const { isAuthenticated, isLoading, logout } = useAuth0();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:8080/profile', {
                    credentials: 'include',
                });

                if (response.status === 401) {
                    setError('Unauthorized access. Please log in.');
                    navigate('/login');
                    return;
                }

                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError('An error occurred while fetching your profile.');
            }
        };

        fetchProfile();
    }, [navigate]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="profile-container">
            <h1>Your Profile</h1>
            {userData && (
                <div className="user-details">
                    {Object.entries(userData).map(([key, value]) => (
                        key === 'picture' ? (
                            <div key={key} className="profile-picture-container">
                                <img src={value as string} alt="Profile" className="profile-picture" />
                            </div>
                        ) : (
                            <p key={key}>
                                <>
                                    <strong>{key}:</strong> {value}
                                </>
                            </p>
                        )
                    ))}
                    <div className="buttons-container">
                        <Link to="/" className="back-button">
                            Back to Main Page
                        </Link>
                        <button
                            onClick={() =>
                                logout({ logoutParams: { returnTo: 'http://localhost:3000/login' } })
                            }
                            className="logout-button"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
