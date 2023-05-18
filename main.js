const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const qs = require('querystring');

const app = express();
// Use the cors middleware to enable CORS
app.use(cors({
    origin: [
        `http://localhost:${PORT}`,
        'https://chat.openai.com'
    ]
}));

const PORT = process.env.PORT || 3100;
const HOST_URL = "https://example.com";

app.get('/players', async (req, res) => {
    const query = req.query.query;
    const response = await axios.get(`${HOST_URL}/api/v1/players?search=${query}&page=0&per_page=100`);
    res.status(200).json(response.data);
});

app.get('/teams', async (req, res) => {
    const response = await axios.get(`${HOST_URL}/api/v1/teams?page=0&per_page=100`);
    res.status(200).json(response.data);
});

app.get('/games', async (req, res) => {
    const query_params = { page: '0', per_page: req.query.limit || '100', start_date: req.query.start_date, end_date: req.query.end_date, seasons: req.query.seasons, team_ids: req.query.team_ids };
    const response = await axios.get(`${HOST_URL}/api/v1/games?${qs.stringify(query_params)}`);
    res.status(200).json(response.data);
});

app.get('/stats', async (req, res) => {
    const query_params = { page: '0', per_page: req.query.limit || '100', start_date: req.query.start_date, end_date: req.query.end_date, player_ids: req.query.player_ids, game_ids: req.query.game_ids };
    const response = await axios.get(`${HOST_URL}/api/v1/stats?${qs.stringify(query_params)}`);
    res.status(200).json(response.data);
});

app.get('/season_averages', async (req, res) => {
    const query_params = { season: req.query.season, player_ids: req.query.player_ids };
    const response = await axios.get(`${HOST_URL}/api/v1/season_averages?${qs.stringify(query_params)}`);
    res.status(200).json(response.data);
});

// Add a route to serve the plugin logo
app.get('/logo.png', (req, res) => {
    const filename = 'logo.png';
    res.type('png').sendFile(filename);
});

// Add a route to serve the plugin manifest
app.get('/.well-known/ai-plugin.json', (req, res) => {
    const host = req.headers.host;
    const text = fs.readFileSync('manifest.json', 'utf8').replace('PLUGIN_HOSTNAME', `https://${host}`);
    res.type('json').send(text);
});

// Add a route to serve the OpenAPI spec
app.get('/openapi.yaml', (req, res) => {
    const host = req.headers.host;
    const text = fs.readFileSync('openapi.yaml', 'utf8').replace('PLUGIN_HOSTNAME', `https://${host}`);
    res.type('yaml').send(text);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
