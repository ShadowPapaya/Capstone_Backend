const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Load the service account key file
const credentials = JSON.parse(fs.readFileSync('/credentials.json'));

// Google Sheets configuration
const spreadsheetId = '1ARmiXfzcgx2pMnB15LyGQGSeiY1Itz7uB4feiuOXvoo'; // Replace with your Google Sheets ID
const sheets = google.sheets({
    version: 'v4', auth: new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })
});

// Function to get the latest data row
async function getLatestSensorData() {
    const range = 'Sheet1!A:G'; // Adjust range based on your columns
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    const rows = response.data.values;
    if (!rows.length) throw new Error('No data found.');

    // Get the latest row
    return rows[rows.length - 1];
}

// Endpoint to fetch the latest data
app.get('/api/latest-sensor-data', async (req, res) => {
    try {
        const data = await getLatestSensorData();
        res.json(data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});