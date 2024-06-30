const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(express.json());

const dataFilePath = path.join(__dirname, 'data', 'formData.json');
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Static demo data for testing
const staticDemoData = [
    {
        "name": "Demo",
        "email": "demo@gmail.com",
        "service": "Development",
        "budget": "$50,000+"
    }
];

// Ensure formData.json exists with initial data if not present
fs.writeFile(dataFilePath, JSON.stringify(staticDemoData, null, 2), (err) => {
    if (err) {
        console.error('Error creating initial file:', err);
    }
});

app.post('/saveFormData', (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData); // Add this for debugging

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading file' });
        }

        let existingData = [];
        if (data) {
            try {
                existingData = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                return res.status(500).json({ error: 'Error parsing existing data' });
            }
        }

        existingData.push(formData);

        fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).json({ error: 'Error writing file' });
            }
            console.log('Form data saved successfully:', formData); // Add this for debugging
            res.status(200).json({ message: 'Form data saved successfully' });
        });
    });
});


app.get('/getFormData', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading file' });
        }

        const formData = JSON.parse(data);
        res.json(formData);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
