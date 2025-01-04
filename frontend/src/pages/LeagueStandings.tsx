import React, { useEffect, useState } from 'react';
import '../styles/LeagueStandings.css';
import { Link } from 'react-router-dom';

interface LeagueStanding {
    clubid: number;
    clubname: string;
    leagueposition: number;
    points: number;
    wins: number;
    losses: number;
}

const LeagueStandings: React.FC = () => {
    const [leagueStandings, setLeagueStandings] = useState<LeagueStanding[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/league-standings')
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'OK') {
                    setLeagueStandings(data.response);
                } else {
                    console.error('Failed to fetch league standings:', data.message);
                }
            })
            .catch((error) => {
                console.error('Error fetching league standings:', error);
            });
    }, []);


    return (
        <div className="league-standings-container">
            <h2>French League Standings</h2>
            <table className="league-standings-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Club</th>
                        <th>Points</th>
                        <th>Wins</th>
                        <th>Losses</th>
                    </tr>
                </thead>
                <tbody>
                    {leagueStandings.map((standing) => (
                        <tr key={standing.clubid}>
                            <td>{standing.leagueposition}</td>
                            <td>
                                <Link to={`/clubs/${standing.clubid}`} className="linkClubsPlayers">
                                    {standing.clubname}
                                </Link>
                            </td>
                            <td>{standing.wins * 3}</td>
                            <td>{standing.wins}</td>
                            <td>{standing.losses}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="add-new-club-button-div">
                <Link to="/add-club" className="add-new-club-button">
                    Add New Club
                </Link>
            </div>
        </div>
    );
};

export default LeagueStandings;
