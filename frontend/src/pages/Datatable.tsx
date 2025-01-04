import React, { useEffect, useState } from 'react';
import '../styles/Datatable.css';
import { Link } from 'react-router-dom';

/**
 * Sučelje igrača
 */
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

/**
 * Sučelje kluba
 */
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
    seasonid: string;
    players: Player[];
}

/**
 * Stranica za prikaz skupa podataka u obliku tablice
 * @returns prikaz stranice
 */
const DataTable: React.FC = () => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [filterField, setFilterField] = useState<string>('all');
    const [visibleRows, setVisibleRows] = useState<number>(20);

    //Dohvaćanje klubova
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/clubs');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'OK') {
                    const groupedClubs: Club[] = [];
                    //grupiranje po klubu
                    data.response.forEach((row: any) => {
                        //provjera postoji li klub
                        const club = groupedClubs.find(c => c.clubid === row.clubid);
                        if (club) {
                            //dodavanje igrača u polje igrača kluba
                            club.players.push({
                                playerid: row.playerid,
                                playername: row.playername,
                                position: row.position,
                                age: row.age,
                                nationality: row.nationality,
                                goalsscored: row.goalsscored,
                                assists: row.assists,
                                matchesplayed: row.matchesplayed,
                                salary: row.salary
                            });
                        } else {
                            //dodavanje kluba i igrača
                            groupedClubs.push({
                                clubid: row.clubid,
                                clubname: row.clubname,
                                stadium: row.stadium,
                                location: row.location,
                                establishedyear: row.establishedyear,
                                manager: row.manager,
                                leagueposition: row.leagueposition,
                                wins: row.wins,
                                losses: row.losses,
                                totalplayers: row.totalplayers,
                                seasonid: row.seasonid,
                                players: [{
                                    playerid: row.playerid,
                                    playername: row.playername,
                                    position: row.position,
                                    age: row.age,
                                    nationality: row.nationality,
                                    goalsscored: row.goalsscored,
                                    assists: row.assists,
                                    matchesplayed: row.matchesplayed,
                                    salary: row.salary
                                }]
                            });
                        }
                    });
                    //ažuriranje vrijednosti s klubovima
                    setClubs(groupedClubs);
                } else {
                    console.error('Failed to fetch clubs:', data.message);
                }
            } catch (err) {
                console.error('Error fetching clubs data:', err);
            }
        };

        fetchClubs();
    }, []);


    //filtriranje klubova
    const filteredClubs = clubs.flatMap(club => {
        const searchText = filter.toLowerCase();
        //filter je prazan - prikaz pune tablice
        if (filter === '') {
            return club.players.map(player => ({
                ...player,
                clubid: club.clubid,
                clubname: club.clubname,
                stadium: club.stadium,
                location: club.location,
                establishedyear: club.establishedyear,
                manager: club.manager,
                leagueposition: club.leagueposition,
                wins: club.wins,
                losses: club.losses,
                totalplayers: club.totalplayers,
                seasonid: club.seasonid
            }));
        }
        //filtriranje po igračima i klubovima
        const filteredPlayers = club.players.filter(player => {
            if (filterField === 'all') {
                const lowerSearchText = searchText.toLowerCase();
                const clubFields: (keyof Club)[] = [
                    'clubname', 'stadium', 'location', 'establishedyear',
                    'manager', 'leagueposition', 'wins', 'losses', 'totalplayers'
                ];
                //Provjera sadrži li klub pojam koji je unesen
                const clubMatch = clubFields.some((field: keyof Club) => {
                    const value = club[field];
                    return value !== undefined && value !== null && value.toString().toLowerCase().includes(lowerSearchText);
                });
                //Provjera sadrži li igrač pojam koji je unesen
                const playerMatch = Object.values(player).some(value =>
                    value !== undefined && value !== null && value.toString().toLowerCase().includes(lowerSearchText)
                );

                return clubMatch || playerMatch;
            } else if (filterField === 'clubname') {
                return club.clubname && club.clubname.toLowerCase().includes(searchText);
            } else if (filterField === 'stadium') {
                return club.stadium && club.stadium.toLowerCase().includes(searchText);
            } else if (filterField === 'location') {
                return club.location && club.location.toLowerCase().includes(searchText);
            } else if (filterField === 'manager') {
                return club.manager && club.manager.toLowerCase().includes(searchText);
            } else if (filterField === 'leagueposition') {
                return club.leagueposition.toString().includes(searchText);
            } else if (filterField === 'wins') {
                return club.wins.toString().includes(searchText);
            } else if (filterField === 'losses') {
                return club.losses.toString().includes(searchText);
            } else if (filterField === 'totalplayers') {
                return club.totalplayers.toString().includes(searchText);
            } else if (filterField === 'establishedyear') {
                return club.establishedyear.toString().includes(searchText);
            } else {
                //Pretraga po pojedinim poljima igrača
                const fieldValue = player[filterField as keyof Player];
                return fieldValue !== undefined && fieldValue !== null && fieldValue.toString().toLowerCase().includes(searchText);
            }
        });
        //prazna tablica ako nema pronađenih
        if (filteredPlayers.length === 0) {
            return [];
        }
        //filtrirani igrači i klubovi
        return filteredPlayers.map(player => ({
            ...player,
            clubid: club.clubid,
            clubname: club.clubname,
            stadium: club.stadium,
            location: club.location,
            establishedyear: club.establishedyear,
            manager: club.manager,
            leagueposition: club.leagueposition,
            wins: club.wins,
            losses: club.losses,
            totalplayers: club.totalplayers,
            seasonid: club.seasonid
        }));
    });

    //prikaz dodatnih 20 redaka tablice
    const handleShowMore = () => {
        setVisibleRows(prev => prev + 20);
    };

    //smanjivanje tablice za 20 redaka
    const handleShowLess = () => {
        setVisibleRows(prev => Math.max(prev - 20, 20));
    };

    //generiranje imena za preuzimanje filtriranih podataka
    const generateFileName = (baseName: string, extension: string) => {
        const fieldName = filterField !== 'all' ? filterField : 'AllFields';
        const searchText = filter ? `_${filter}` : '';
        return `${baseName}_FilteredBy_${fieldName}${searchText}.${extension}`;
    };

    //funkcija za preuzimanje podataka u .csv formatu
    const downloadCSV = async (filteredData: any) => {
        try {
            const fileName = generateFileName("ClubsData", "csv");
            const response = await fetch('http://localhost:8080/download_csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-File-Name': fileName
                },
                body: JSON.stringify(filteredData)
            });

            const data = await response.json();

            if (data.status === 'OK') {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Error downloading CSV:", data.message);
            }
        } catch (error) {
            console.error("Error downloading CSV:", error);
        }
    };


    //funkcija za preuzimanje podataka u .json formatu
    const downloadJSON = async (filteredData: any) => {
        try {
            const fileName = generateFileName("ClubsData", "json");
            const response = await fetch('http://localhost:8080/download_json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-File-Name': fileName
                },
                body: JSON.stringify(filteredData)
            });

            const data = await response.json();

            if (data.status === 'OK') {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Error downloading JSON:", data.message);
            }
        } catch (error) {
            console.error("Error downloading JSON:", error);
        }
    };


    return (
        <div className="main-page-container">
            <h1>Clubs and Players Data Table</h1>
            <div className="centered-container">
                <select
                    value={filterField}
                    onChange={e => setFilterField(e.target.value)}
                >
                    <option value="all">All Fields</option>
                    <option value="clubname">Club Name</option>
                    <option value="stadium">Stadium</option>
                    <option value="location">Location</option>
                    <option value="establishedyear">Established Year</option>
                    <option value="manager">Manager</option>
                    <option value="leagueposition">League Position</option>
                    <option value="wins">Wins</option>
                    <option value="losses">Losses</option>
                    <option value="totalplayers">Total Players</option>
                    <option value="goalsscored">Goals Scored</option>
                    <option value="playername">Player Name</option>
                    <option value="position">Position</option>
                    <option value="nationality">Nationality</option>
                    <option value="age">Age</option>
                    <option value="assists">Assists</option>
                    <option value="matchesplayed">Matches Played</option>
                    <option value="salary">Salary</option>
                </select>
                <input
                    type="text"
                    placeholder="Filter clubs or players..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Club Name</th>
                        <th>Stadium</th>
                        <th>Location</th>
                        <th>Established Year</th>
                        <th>Manager</th>
                        <th>League Position</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Total Players</th>
                        <th>Player Name</th>
                        <th>Position</th>
                        <th>Age</th>
                        <th>Nationality</th>
                        <th>Goals Scored</th>
                        <th>Assists</th>
                        <th>Matches Played</th>
                        <th>Salary</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClubs.slice(0, visibleRows).map(player => (
                        <tr key={player.playerid}>
                            <td>
                                <Link to={`/clubs/${player.clubid}`} className="linkClubsPlayers">
                                    {player.clubname}
                                </Link>
                            </td>
                            <td>{player.stadium}</td>
                            <td>{player.location}</td>
                            <td>{player.establishedyear}</td>
                            <td>{player.manager}</td>
                            <td>{player.leagueposition}</td>
                            <td>{player.wins}</td>
                            <td>{player.losses}</td>
                            <td>{player.totalplayers}</td>
                            <td>
                                <Link to={`/players/${player.playerid}`} className="linkClubsPlayers">
                                    {player.playername}
                                </Link>
                            </td>
                            <td>{player.position}</td>
                            <td>{player.age}</td>
                            <td>{player.nationality}</td>
                            <td>{player.goalsscored}</td>
                            <td>{player.assists}</td>
                            <td>{player.matchesplayed}</td>
                            <td>{player.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                {filteredClubs.length > visibleRows && (
                    <button onClick={handleShowMore}>Show More</button>
                )}

                {visibleRows > 20 && (
                    <button onClick={handleShowLess}>Show Less</button>
                )}
            </div>
            <button onClick={() => downloadCSV(filteredClubs)}>Download filtered data as CSV</button>
            <button onClick={() => downloadJSON(filteredClubs)}>Download filtered data as JSON</button>
        </div>
    );
};

export default DataTable;