import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddNewClub.css';

const AddNewClub: React.FC = () => {
    const [newClub, setNewClub] = useState({
        clubname: '',
        stadium: '',
        location: '',
        establishedyear: 0,
        manager: '',
        leagueposition: 0,
        wins: 0,
        losses: 0,
        totalplayers: 0,
        seasonid: 2025,
    });
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewClub({
            ...newClub,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/clubs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClub),
            });

            const result = await response.json();
            if (response.ok) {
                navigate('/league-standings');
            } else {
                console.error('Failed to add club:', result.message);
            }
        } catch (error) {
            console.error('Error adding club:', error);
        }
    };

    return (
        <div className="add-club-container">
            <h2>Add New Club</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Club Name:
                    <input
                        type="text"
                        name="clubname"
                        value={newClub.clubname}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Stadium:
                    <input
                        type="text"
                        name="stadium"
                        value={newClub.stadium}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={newClub.location}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Established Year:
                    <input
                        type="number"
                        name="establishedyear"
                        value={newClub.establishedyear}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Manager:
                    <input
                        type="text"
                        name="manager"
                        value={newClub.manager}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    League Position:
                    <input
                        type="number"
                        name="leagueposition"
                        value={newClub.leagueposition}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Wins:
                    <input
                        type="number"
                        name="wins"
                        value={newClub.wins}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Losses:
                    <input
                        type="number"
                        name="losses"
                        value={newClub.losses}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Total Players:
                    <input
                        type="number"
                        name="totalplayers"
                        value={newClub.totalplayers}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Season ID:
                    <input
                        type="number"
                        name="seasonid"
                        value={newClub.seasonid}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit">Add Club</button>
            </form>
        </div>
    );
};

export default AddNewClub;
