const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
