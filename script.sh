DB_USER="postgres"
DB_PASS="v6fATA9u"
DB_NAME="OtvRac"
DB_HOST="localhost"
DB_PORT="5432"

OUTPUT_FILE_CSV="clubs_and_players.csv"
OUTPUT_FILE_JSON="clubs_and_players.json"

OUTPUT_FILE_CSV="clubs_and_players.csv"

echo "Club ID, Club Name, Stadium, Location, Established Year, Manager, League Position, Wins, Losses, Total Players, Season Year, Player ID, Player Name, Position, Age, Nationality, Goals Scored, Assists, Matches Played, Salary" > "$OUTPUT_FILE_CSV"
psql -U "$DB_USER" -d "$DB_NAME" -h "$DB_HOST" -p "$DB_PORT" -c "
COPY (
    SELECT
        c.clubid,
        c.clubname,
        c.stadium,
        c.location,
        c.establishedyear,
        c.manager,
        c.leagueposition,
        c.wins,
        c.losses,
        c.totalplayers,
        s.seasonyear,
        p.playerid,
        p.playername,
        p.position,
        p.age,
        p.nationality,
        p.goalsscored,
        p.assists,
        p.matchesplayed,
        p.salary
    FROM player p
    JOIN club c ON p.clubid = c.clubid
    JOIN season s ON s.seasonid = c.seasonid
    ORDER BY c.clubid, p.playerid
) TO STDOUT WITH CSV HEADER" >> "$OUTPUT_FILE_CSV"

echo "CSV export finished."

psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -t -A <<EOF > "$OUTPUT_FILE_JSON"
SELECT json_build_object(
    'clubs', json_agg(club_data ORDER BY clubid)
) AS result
FROM (
    SELECT 
        c.clubid,
        c.clubname,
        c.stadium,
        c.location,
        c.establishedyear,
        c.manager,
        c.leagueposition,
        c.wins,
        c.losses,
        c.totalplayers,
        (
            SELECT json_agg(DISTINCT season_data)
            FROM (
                SELECT s.seasonid, s.seasonyear
                FROM season s 
                WHERE s.seasonid = c.seasonid  
                GROUP BY s.seasonid, s.seasonyear
            ) AS season_data
        ) AS seasons,
        (
            SELECT json_agg(
                json_build_object(
                    'playerid', p.playerid,
                    'playername', p.playername,
                    'position', p.position,
                    'age', p.age,
                    'nationality', p.nationality,
                    'goalsscored', p.goalsscored,
                    'assists', p.assists,
                    'matchesplayed', p.matchesplayed,
                    'clubid', p.clubid,
                    'salary', p.salary
                ) ORDER BY p.playerid
            )
            FROM player p 
            WHERE p.clubid = c.clubid
        ) AS players
    FROM club c
    ORDER BY c.clubid
) AS club_data;

EOF

echo "JSON export finished."