/**
 * Aplikacija koja koristi Express za pružanje podataka o nogometnim klubovima i igračima iz PostgreSQL baze podataka te preuzimanje podataka u .csv i .json formatu
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

//definiranje aplikacije i porta
const app = express();
const PORT = 8080;

//Povezivanje s bazom podataka
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

/**
 * Endpoint za dohvaćanje podataka o nogometnim klubovima i igračima
 *
 * @route GET /api/clubs
 * @async
 * @param {Object} req - Zahtjev
 * @param {Object} res - Odgovor
 *
 * @description
 * Dohvaća podatke iz baze podataka koristeći SQL upit koji spaja tablice "club" i "player".
 *
 * @returns {Object[]} 200 - JSON gdje svaki objekt sadrži informacije o klubu i igračima
 * @returns {Object} 500 - Greška na serveru 
 */
app.get('/api/clubs', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.clubid, c.clubname, c.stadium, c.location, c.establishedyear, 
                c.manager, c.leagueposition, c.wins, c.losses, c.totalplayers, c.seasonid,
                p.playerid, p.playername, p.position, p.age, p.nationality, 
                p.goalsscored, p.assists, p.matchesplayed, p.salary
            FROM club c 
            JOIN player p ON p.clubid = c.clubid
            ORDER BY c.clubid, p.playerid;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ error: 'Error querying database' });
    }
});

/**
 * Endpoint za preuzimanje podataka u CSV formatu
 *
 * @route POST /download_csv
 * @param {Object} req - Zahtjev koji sadrži:
 * @param {Object[]} req.body - Podaci za izvoz u .csv
 * @param {string} req.headers - Opcionalno ime datoteke koje se koristi za preuzimanje CSV-a
 * @param {Object} res - Odgovor koji vraća .csv
 *
 * @description
 * Pretvara podatke u CSV format koristeći zadano zaglavlje. Vraća .csv kao datoteku za preuzimanje
 *
 * @returns {File} 200 - CSV datoteka za preuzimanje
 * @returns {Object} 500 - Greška na serveru
 */
app.post('/download_csv', (req, res) => {
    const data = req.body;
    const fileName = req.headers['x-file-name'] || 'filtered_data.csv';

    try {
        const headers = [
            'clubname', 'stadium', 'location', 'establishedyear', 'manager', 
            'leagueposition', 'wins', 'losses', 'totalplayers', 'seasonid', 
            'playername', 'position', 'age', 'nationality', 
            'goalsscored', 'assists', 'matchesplayed', 'salary'
        ];

        let csv = headers.join(',') + '\n';

        data.forEach(row => {
            const values = headers.map(header => row[header]);
            csv += values.join(',') + '\n';
        });

        res.header('Content-Type', 'text/csv');
        res.attachment(fileName);
        res.send(csv);
    } catch (error) {
        console.error("Error generating CSV:", error);
        res.status(500).json({ error: 'Error generating CSV' });
    }
});

/**
 * Endpoint za preuzimanje podataka u .json formatu
 *
 * @route POST /download_json
 * @param {Object} req - Zahtjev koji sadrži:
 * @param {Object[]} req.body - Podaci za izvoz u .json
 * @param {string} req.headers - Opcionalno ime datoteke koje se koristi za preuzimanje JSON-a
 * @param {Object} res - Odgovor koji vraća .json
 *
 * @description
 * Pretvara podatke u .json format i omogućuje preuzimanje
 *
 * @returns {File} 200 - JSON datoteka za preuzimanje
 * @returns {Object} 500 - Greška na serveru
 */
app.post('/download_json', (req, res) => {
    const data = req.body;
    const fileName = req.headers['x-file-name'] || 'filtered_data.json';

    try {
        res.header('Content-Type', 'application/json');
        res.attachment(fileName);
        res.send(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error generating JSON:", error);
        res.status(500).json({ error: 'Error generating JSON' });
    }
});

//Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});