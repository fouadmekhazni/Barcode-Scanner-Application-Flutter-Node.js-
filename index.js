const express = require('express');
const bodyParser = require('body-parser');
const sql = require("msnodesqlv8");
const axios = require('axios');


const app = express();
const PORT = process.env.PORT || 2000;

app.use(bodyParser.json());

const connectionString = "driver={SQL Server}; APP=msnodesqlv8; Server=192.168.1.5; Database={database1}; Trusted_Connection=Yes";

const connectToSqlServer = async () => {
    try {
        await sql.connect(connectionString);
        console.log("Connected to SQL Server");

    } catch (error) {
        console.error('Error connecting to SQL Server:', error.message);
    }
};

connectToSqlServer();

app.post('/api/locations/save', async (req, res) => {
    const { LocationID, code, designation1, designation2 } = req.body;

    try {
        const query = `INSERT INTO [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[locations] (code, Designation1, Designation2) 
                       VALUES ('${code}', '${designation1}','${designation2}')`;

        await sql.query(connectionString, query);
        console.log("Location saved successfully,", code, designation1, designation2);

        res.json({ message: 'Location saved successfully' });

    } catch (error) {
        console.error('Error saving location:', error.message);
        res.status(500).json({ error: 'Error saving location' });
    }
});

app.put('/api/locations/update', async (req, res) => {
    const { code, designation1, designation2 } = req.body;

    try {
        const query = `UPDATE [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[locations] 
                       SET Designation1 = '${designation1}', Designation2 = '${designation2}'
                       WHERE code = '${code}'`;

        await sql.query(connectionString, query);
        console.log("Location updated successfully,", code, designation1, designation2);

        res.json({ message: 'Location updated successfully' });

    } catch (error) {
        console.error('Error updating location:', error.message);
        res.status(500).json({ error: 'Error updating location' });
    }
});

app.delete('/api/locations/delete/:code', async (req, res) => {
    const code = req.params.code;


    try {
        const query = `DELETE FROM [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[locations] 
                       WHERE code = '${code}'`;

        await sql.query(connectionString, query);
        console.log("Location deleted successfully,", code);

        res.json({ message: 'Location deleted successfully' });

    } catch (error) {
        console.error('Error deleting location:', error.message);
        res.status(500).json({ error: 'Error deleting location' });
    }
});

app.post('/api/immobilisations/save', async (req, res) => {

    const { code, designation1, designation2, locationID } = req.body;
    
    try {
        const query = `INSERT INTO [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[Immobilisations] (Code, Designation1, Designation2, LocationID) 
                       VALUES ('${code}', '${designation1}', '${designation2}')`;

        await sql.query(connectionString, query);
        console.log("Immobilisation saved successfully,", code, designation1, designation2);

        res.json({ message: 'Immobilisation saved successfully' });

    } catch (error) {
        console.error('Error saving immobilisation:', error.message);
        res.status(500).json({ error: 'Error saving immobilisation' });

    }

});

app.put('/api/immobilisations/update', async (req, res) => {
    const { code, designation1, designation2, locationID } = req.body;

    try {
        const query = `UPDATE [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[Immobilisations] 
                       SET Designation1 = '${designation1}', Designation2 = '${designation2}', LocationID = '${locationID}'
                       WHERE Code = '${code}'`;

        await sql.query(connectionString, query);
        console.log("Immobilisation updated successfully,", code, designation1, designation2, locationID);

        res.json({ message: 'Immobilisation updated successfully' });

    } catch (error) {
        console.error('Error updating immobilisation:', error.message);
        res.status(500).json({ error: 'Error updating immobilisation' });
    }
});

app.delete('/api/immobilisations/delete/:code', async (req, res) => {
    const code = req.params.code;

    try {
        const query = `DELETE FROM [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[Immobilisations] 
                       WHERE Code = '${code}'`;

        await sql.query(connectionString, query);
        console.log("Immobilisation deleted successfully,", code);

        res.json({ message: 'Immobilisation deleted successfully' });

    } catch (error) {
        console.error('Error deleting immobilisation:', error.message);
        res.status(500).json({ error: 'Error deleting immobilisation' });
    }
});

app.get('/api/immobilisations', async (req, res) => {
    try {
        const query = `SELECT * FROM [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[Immobilisations]`;
        const result = await sql.query(connectionString, query);
        console.log("Immobilisations fetched successfully");
        res.json(result);
    } catch (error) {
        console.error('Error fetching immobilisations:', error.message);
        res.status(500).json({ error: 'Error fetching immobilisations' });
    }
});

app.get('/api/locations', async (req, res) => {
    try {
        const query = `SELECT * FROM [TCHINLAIT-WMS 24-12].[TCHIN-LAIT\\fouad.mekhazni].[locations]`;
        const result = await sql.query(connectionString, query);
        console.log("Locations retrieved successfully");

        res.json(result);

    } catch (error) {
        console.error('Error retrieving locations:', error.message);
        res.status(500).json({ error: 'Error retrieving locations' });
    }
});





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



