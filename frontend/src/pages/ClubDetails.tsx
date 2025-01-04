import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/ClubDetails.css';

interface Club {
    clubid: number;
    clubname: string;
    stadium: string;
    location: string;
    establishedyear: number;
    manager: string;
    leagueposition: number;
    wins: number;
    losses: number;
    totalplayers: number;
    seasonid: number;
}

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
}

interface LeagueStanding {
    clubid: number;
    clubname: string;
    leagueposition: number;
    wins: number;
    losses: number;
}

const ClubDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [club, setClub] = useState<Club | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [leagueStandings, setLeagueStandings] = useState<LeagueStanding[]>([]);
    const [visiblePositions, setVisiblePositions] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/api/clubs/${id}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'OK') {
                    setClub(data.response);
                } else {
                    console.error('Failed to fetch club details:', data.message);
                }
            })
            .catch((error) => console.error('Error fetching club details', error));

        fetch(`http://localhost:8080/api/clubs/${id}/players`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'OK') {
                    setPlayers(data.response);
                } else {
                    console.error('Failed to fetch players:', data.message);
                }
            })
            .catch((error) => console.error('Error fetching players', error));
    }, [id]);

    const handleDeleteClub = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this club?');
        if (confirmDelete && club) {
            try {
                const response = await fetch(`http://localhost:8080/api/clubs/${club.clubid}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.status === 'OK') {
                    alert('Club deleted successfully');
                    navigate('/league-standings');
                } else {
                    alert('Failed to delete club');
                }
            } catch (error) {
                console.error('Error deleting club:', error);
                alert('An error occurred while trying to delete the club');
            }
        }
    };

    const togglePositionVisibility = (position: string) => {
        setVisiblePositions((prev) => {
            const newVisiblePositions = new Set(prev);
            if (newVisiblePositions.has(position)) {
                newVisiblePositions.delete(position);
            } else {
                newVisiblePositions.add(position);
            }
            return newVisiblePositions;
        });
    };

    if (!club) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="club-details-container">
            <h1>{club.clubname}</h1>
            <p><strong>Stadium:</strong> {club.stadium}</p>
            <p><strong>Location:</strong> {club.location}</p>
            <p><strong>Established:</strong> {club.establishedyear}</p>
            <p><strong>Manager:</strong> {club.manager}</p>
            <p><strong>Total Players:</strong> {club.totalplayers}</p>

            <div style={{ marginTop: '20px' }}>
                <Link to="/league-standings" className="linkToLeagueStandings">
                    View League Standings
                </Link>
            </div>

            <h2>Players</h2>
            <div className="players-container">
                {['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map((position) => {
                    const playersByPosition = players.filter((player) => player.position === position);

                    if (playersByPosition.length === 0) return null;

                    return (
                        <div key={position} className="position-group">
                            <h3
                                onClick={() => togglePositionVisibility(position)}
                                style={{ cursor: 'pointer', color: '#007bff' }}
                            >
                                {position}s
                            </h3>

                            <div
                                className={`players-group ${visiblePositions.has(position) ? 'visible' : ''}`}
                            >
                                {playersByPosition.map((player) => (
                                    <Link
                                        to={`/players/${player.playerid}`}
                                        className='linkForClubDetails'
                                        key={player.playerid}
                                    >
                                        <div className="player-card">
                                            <div className="player-info">
                                                <h4>{player.playername}</h4>
                                                <p className="player-position">{player.position}</p>
                                            </div>
                                            <div className="player-stats">
                                                <p><strong>Age:</strong> {player.age}</p>
                                                <p><strong>Goals Scored:</strong> {player.goalsscored}</p>
                                                <p><strong>Assists:</strong> {player.assists}</p>
                                                <p><strong>Matches Played:</strong> {player.matchesplayed}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className='delete-club-button-div'>
                <button onClick={handleDeleteClub} className="delete-club-button">
                    Delete Club
                </button>
            </div>
        </div>
    );
};

export default ClubDetails;
