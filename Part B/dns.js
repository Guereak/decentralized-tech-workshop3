const express = require('express');
const app = express();
const PORT = 4000;

const serverPort = 3001; // Port du serveur Hello World
const serverUrl = `localhost:${serverPort}`;

app.get('/getServer', (req, res) => {
    res.json({ code: 200, server: serverUrl });
});

app.listen(PORT, () => {
    console.log(`DNS Registry is running on http://localhost:${PORT}`);
});