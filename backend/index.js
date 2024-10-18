// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Route to get sales data
app.get('/api/sales', async (req, res) => {
    try {
        const response = await axios.get('https://insurecomp.com/sales-data.txt');
        const salesData = parseSalesData(response.data);
        res.json(salesData);
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ error: "Failed to fetch sales data" });
    }
});

// Function to parse sales data from text format
const parseSalesData = (data) => {
    const lines = data.split('\n');
    const salesData = [];

    lines.forEach(line => {
        const [month, item, quantity, price] = line.split(',');
        if (month && item && quantity && price) {
            salesData.push({
                month: month.trim(),
                item: item.trim(),
                quantity: parseInt(quantity.trim(), 10),
                price: parseFloat(price.trim()),
            });
        }
    });

    return salesData;
};

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});