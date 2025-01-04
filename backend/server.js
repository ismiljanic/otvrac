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
 * Standardizirani odgovor za sve rute
 * 
 * @param {Object} res - Odgovor
 * @param {string} status - Status odgovora (OK, ERROR)
 * @param {string} message - Ljudski čitljiva poruka
 * @param {Object|Array} response - Sadržaj odgovora
 */
const sendResponse = (res, status, message, response) => {
    res.status(status === 'OK' ? 200 : 500).json({
        status,
        message,
        response,
    });
};

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
        sendResponse(res, 'OK', 'Fetched club and player data', result.rows);
    } catch (error) {
        console.error("Error querying database:", error);
        sendResponse(res, 'ERROR', 'Error querying database', {});
    }
});

/**
 * Endpoint za dohvaćanje podataka o nogometnom klubu na temelju jedinstvenog identifikatora kluba
 *
 * @route GET /api/clubs/:id
 * @async
 * @param {Object} req - Zahtjev
 * @param {Object} res - Odgovor
 *
 * @description
 * Dohvaća klub iz baze podataka koristeći SQL upit parametriziran po identifikatoru kluba
 *
 * @returns {Object[]} 200 - Detalji za pojedini klub
 * @returns {Object[]} 404 - Klub nije pronađen
 * @returns {Object} 500 - Greška na serveru 
 */
app.get('/api/clubs/:id', async (req, res) => {
    const clubId = req.params.id;
    try {
        const result = await pool.query(
            `
            SELECT 
                clubid, clubname, stadium, location, establishedyear, manager, leagueposition, wins, losses, totalplayers, seasonid 
            FROM club
            WHERE clubid = $1
            `, [clubId]);

        if (result.rows.length === 0) {
            return sendResponse(res, 'ERROR', 'Club not found', {});
        }

        sendResponse(res, 'OK', 'Fetched club details', result.rows[0]);
    } catch (error) {
        console.error("Error querying database", error);
        sendResponse(res, 'ERROR', 'Error querying database', {});
    }
});

/**
 * Endpoint za dohvaćanje podataka o igraču pojedinog kluba na temelju jedinstvenog identifikatora igrača
 *
 * @route GET /api/players/:id
 * @async
 * @param {Object} req - Zahtjev
 * @param {Object} res - Odgovor
 *
 * @description
 * Dohvaća igrča iz baze podataka koristeći SQL upit parametriziran po identifikatoru igrača
 *
 * @returns {Object[]} 200 - Detalji za pojedinog igrača
 * @returns {Object[]} 404 - Igrač nije pronađen
 * @returns {Object} 500 - Greška na serveru 
 */
app.get('/api/players/:id', async (req, res) => {
    const playerId = req.params.id;
    try {
        const result = await pool.query(
            `
            SELECT 
                playerid, playername, position, age, nationality, 
                goalsscored, assists, matchesplayed, salary, clubid
            FROM player
            WHERE playerid = $1
            `, [playerId]);

        if (result.rows.length === 0) {
            return sendResponse(res, 'ERROR', 'Player not found', {});
        }

        sendResponse(res, 'OK', 'Fetched player details', result.rows[0]);
    } catch (error) {
        console.error("Error querying database:", error);
        sendResponse(res, 'ERROR', 'Error querying database', {});
    }
});

/**
 * Endpoint za dohvaćanje podataka o svim igračima nogometnog kluba na temelju jedinstvenog identifikatora kluba
 *
 * @route GET /api/clubs/:id/players
 * @async
 * @param {Object} req - Zahtjev
 * @param {Object} res - Odgovor
 *
 * @description
 * Dohvaća sve igrače iz baze podataka za pojedini klub koristeći SQL upit parametriziran po identifikatoru kluba
 *
 * @returns {Object[]} 200 - Svi igrači za pojedini klub
 * @returns {Object[]} 404 - Igrači za pojedini klub nisu pronađeni
 * @returns {Object} 500 - Greška na serveru 
 */
app.get('/api/clubs/:id/players', async (req, res) => {
    const clubId = req.params.id;
    try {
        const result = await pool.query(
            `
            SELECT 
                playerid, playername, position, age, nationality, 
                goalsscored, assists, matchesplayed, salary, clubid
            FROM player
            WHERE clubid = $1
            `, [clubId]);

        if (result.rows.length === 0) {
            return sendResponse(res, 'ERROR', 'No players found for this club', {});
        }

        sendResponse(res, 'OK', 'Fetched players for club', result.rows);
    } catch (error) {
        console.error("Error querying database:", error);
        sendResponse(res, 'ERROR', 'Error querying database', {});
    }
});

/**
 * Endpoint za dohvaćanje trenutne ljestvice klubova
 *
 * @route GET /api/league-standings
 * @async
 * @param {Object} req - Zahtjev
 * @param {Object} res - Odgovor
 *
 * @description
 * Dohvaća sve klubove iz baze podataka i sortira ih prema trenutnoj poziciji na ljestvici
 *
 * @returns {Object[]} 200 - Ljestvica klubova
 * @returns {Object} 500 - Greška na serveru 
 */
app.get('/api/league-standings', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                clubid, clubname, leagueposition, wins, losses
            FROM club
            ORDER BY leagueposition;
        `);

        sendResponse(res, 'OK', 'Fetched league standings', result.rows);
    } catch (error) {
        console.error("Error querying database:", error);
        sendResponse(res, 'ERROR', 'Error querying league standings', {});
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
        sendResponse(res, 'ERROR', 'Error generating CSV', {});
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
        sendResponse(res, 'ERROR', 'Error generating JSON', {});
    }
});

/**
 * Endpoint za kreiranje nogometnog kluba i njegovo dodavanje u bazu podataka
 *
 * @route POST /api/clubs
 * @async
 * @param {Object} req - Zahtjev
 * @param {Object} res - Odgovor
 *
 * @description
 * Kreira novi klub pomoću forme za upis informacija
 *
 * @returns {Object[]} 200 - Klub je uspješno kreiran
 * @returns {Object[]} 400 - Nisu ispunjena sva obavezna polja
 * @returns {Object} 500 - Greška na serveru 
 */
app.post('/api/clubs', async (req, res) => {
    const {
        clubname,
        stadium,
        location,
        establishedyear,
        manager,
        leagueposition,
        wins,
        losses,
        totalplayers
    } = req.body;

    if (!clubname || !stadium || !location || !establishedyear || !manager ||
        leagueposition === undefined || wins === undefined || losses === undefined ||
        totalplayers === undefined) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const result = await pool.query('SELECT MAX(clubid) FROM club');
        const maxClubId = result.rows[0].max || 0;

        const newClubId = maxClubId + 1;

        const insertResult = await pool.query(
            `INSERT INTO club (clubid, clubname, stadium, location, establishedyear, manager, 
                               leagueposition, wins, losses, totalplayers, seasonid)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1) RETURNING *`,
            [newClubId, clubname, stadium, location, establishedyear, manager, leagueposition, wins, losses, totalplayers]
        );

        sendResponse(res, 'OK', 'Club successfully added.', insertResult.rows[0]);
    } catch (error) {
        console.error("Error inserting club:", error);
        sendResponse(res, 'ERROR', 'Error adding club to the database', {});
    }
});

/**
 * Endpoint za promjenu informacija vezanih uz pojedinog igrača
 *
 * @route PUT /api/players/:id
 * @async
 * @param {Object} req - Zahtjev
 * @param {Object} res - Odgovor
 *
 * @description
 * Ažurira detalje vezane za pojedinog igrača na temelju njegovog jedinstvenog identifikatora
 *
 * @returns {Object[]} 200 - Uspješno su ažurirane vrijednosti za pojedinog igrača
 * @returns {Object[]} 400 - Nisu ispunjena sva obavezna polja
 * @returns {Object[]} 404 - Igrač nije pronađen
 * @returns {Object} 500 - Greška na serveru 
 */
app.put('/api/players/:id', async (req, res) => {
    const playerId = parseInt(req.params.id);
    const {
        playername,
        position,
        age,
        nationality,
        goalsscored,
        assists,
        matchesplayed,
        salary,
        clubid
    } = req.body;

    if (!playername || !position || !age || !nationality || goalsscored === undefined || 
        assists === undefined || matchesplayed === undefined || salary === undefined || !clubid) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const updateResult = await pool.query(
            `UPDATE player
             SET playername = $1, position = $2, age = $3, nationality = $4,
                 goalsscored = $5, assists = $6, matchesplayed = $7, salary = $8, clubid = $9
             WHERE playerid = $10
             RETURNING *`,
            [playername, position, age, nationality, goalsscored, assists, matchesplayed, salary, clubid, playerId]
        );

        if (updateResult.rows.length > 0) {
            sendResponse(res, 'OK', 'Player successfully updated.', updateResult.rows[0]);
        } else {
            sendResponse(res, 'ERROR', 'Player not found.', {});
        }
    } catch (error) {
        console.error("Error updating player:", error);
        sendResponse(res, 'ERROR', 'Error updating player data in the database', {});
    }
});

/**
 * Endpoint za brisanje pojedinog kluba
 *
 * @route DELETE /api/clubs/:clubid
 * @async
 * @param {Object} req - Zahtjev
 * @param {Object} res - Odgovor
 *
 * @description
 * Briše pojedini klub na temelju njegovog jedinstvenog identifikatora
 *
 * @returns {Object[]} 200 - Uspješno izbrisan klub
 * @returns {Object[]} 400 - Nisu ispunjena sva obavezna polja
 * @returns {Object[]} 404 - Klub nije pronađen
 * @returns {Object} 500 - Greška na serveru 
 */
app.delete('/api/clubs/:clubid', async (req, res) => {
    const { clubid } = req.params;

    if (!clubid) {
        return res.status(400).json({ message: 'Club ID is required.' });
    }

    try {
        const result = await pool.query('DELETE FROM club WHERE clubid = $1 RETURNING *', [clubid]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Club not found.' });
        }

        sendResponse(res, 'OK', 'Club successfully deleted.', result.rows[0]);
    } catch (error) {
        console.error("Error deleting club:", error);
        sendResponse(res, 'ERROR', 'Error deleting club from the database', {});
    }
});

/**
 * Error handling za nepostojeće krajnje točke (404)
 */
app.use((req, res) => {
    sendResponse(res, 'Not Found', 'The requested resource was not found', null);
});

/**
 * Error handling za nevaljane metode (405)
 */
app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'POST') {
        sendResponse(res, 'Method Not Allowed', 'The HTTP method is not allowed for the requested resource', null);
    } else {
        next();
    }
});

/**
 * Error handling za neimplementirane metode (501)
 */
app.use((req, res) => {
    sendResponse(res, 'Not Implemented', 'Method not implemented for requested resource', null);
});

//Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});