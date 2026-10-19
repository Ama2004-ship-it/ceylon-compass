const pool = require('../config/db');

async function getCategories(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load categories.' });
  }
}

module.exports = { getCategories };
