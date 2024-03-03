const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgre',
  port: 5432,
});

app.get('/get-data', async (req, res) => {
  try {
    const { page = 1, sortBy = 'date', search = '' } = req.query;
    const limit = 20;
    const offset = (page - 1) * limit;

    const client = await pool.connect();
    let query = `
      SELECT * FROM customer
      WHERE customer_name ILIKE $1 OR location ILIKE $1
      ORDER BY ${sortBy} LIMIT $2 OFFSET $3
    `;
    const result = await client.query(query, [`%${search}%`, limit, offset]);

    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});