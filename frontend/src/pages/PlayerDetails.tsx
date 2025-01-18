import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PlayerDetails.css';

interface Player {
    playerid: number;
    playername: string;
    position: string;
    age: number;
    nationality: string;
    goalsscored: number;
    assists: number;
    matchesplayed: number;
    salary: number;
    clubid: number;
}

const PlayerDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [player, setPlayer] = useState<Player | null>(null);
    const [updatedPlayer, setUpdatedPlayer] = useState<Player | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [jsonLd, setJsonLd] = useState<any | null>(null);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/players/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch player details');
                }

                const data = await response.json();

                if (data.status === 'OK') {
                    setPlayer(data.response.playerData);
                    setJsonLd(data.response.jsonLd);
                    setUpdatedPlayer(data.response.playerData);
                } else {
                    console.error('Failed to fetch player:', data.message);
                }
            } catch (error) {
                console.error('Error fetching player details:', error);
            }
        };

        fetchPlayer();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (updatedPlayer) {
            setUpdatedPlayer({
                ...updatedPlayer,
                [name]: name === 'age' || name === 'goalsscored' || name === 'assists' || name === 'matchesplayed' || name === 'salary' || name === 'clubid' ? parseInt(value) : value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (updatedPlayer) {
            try {
                const response = await fetch(`http://localhost:8080/api/players/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedPlayer),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Player updated successfully');
                    setPlayer(updatedPlayer);
                    setIsEditing(false);
                } else {
                    alert('Error updating player');
                    console.error('Error:', data.message);
                }
            } catch (error) {
                console.error('Error updating player:', error);
            }
        }
    };

    if (!player || !updatedPlayer) {
        return <div>Loading...</div>;
    }

    return (
        <div className="player-details-container">
            <h1>{isEditing ? 'Edit Player' : player.playername}</h1>
            
            {jsonLd && (
                <div>
                    <p><strong>Position:</strong> {jsonLd.position || player.position}</p>
                    <p><strong>Age:</strong> {jsonLd.age || player.age}</p>
                    <p><strong>Nationality:</strong> {jsonLd.nationality || player.nationality}</p>
                    <p><strong>Goals Scored:</strong> {jsonLd.goalsscored || player.goalsscored}</p>
                    <p><strong>Assists:</strong> {jsonLd.assists || player.assists}</p>
                    <p><strong>Matches Played:</strong> {jsonLd.matchesplayed || player.matchesplayed}</p>
                    <p><strong>Salary:</strong> {jsonLd.salary || player.salary}</p>
                </div>
            )}
            
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        Player Name:
                        <input
                            type="text"
                            name="playername"
                            value={updatedPlayer.playername}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Position:
                        <input
                            type="text"
                            name="position"
                            value={updatedPlayer.position}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Age:
                        <input
                            type="number"
                            name="age"
                            value={updatedPlayer.age}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Nationality:
                        <input
                            type="text"
                            name="nationality"
                            value={updatedPlayer.nationality}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Goals Scored:
                        <input
                            type="number"
                            name="goalsscored"
                            value={updatedPlayer.goalsscored}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Assists:
                        <input
                            type="number"
                            name="assists"
                            value={updatedPlayer.assists}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Matches Played:
                        <input
                            type="number"
                            name="matchesplayed"
                            value={updatedPlayer.matchesplayed}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Salary:
                        <input
                            type="number"
                            name="salary"
                            value={updatedPlayer.salary}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Club ID:
                        <input
                            type="number"
                            name="clubid"
                            value={updatedPlayer.clubid}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <button type="submit">Save Changes</button>
                </form>
            ) : (
                <div>
                    <button onClick={() => setIsEditing(true)} className='editPlayerButton'>Edit Player</button>
                </div>
            )}
        </div>
    );
};

export default PlayerDetails;
