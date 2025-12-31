const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Routes for main pages specifically (optional but good for clean URLs)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Fallback to index.html for SPA-like behavior if needed, 
// but since we have multiple HTML files, express.static handles most cases.

app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`🚀 Invertis LMS Server is running!`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`-----------------------------------------------`);
});
