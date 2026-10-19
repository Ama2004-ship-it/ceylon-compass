const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    const admin = rows[0];

    const genericError = { message: 'Invalid username or password.' };

    if (!admin) {
      return res.status(401).json(genericError);
    }

    const passwordMatches = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatches) {
      return res.status(401).json(genericError);
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong while logging in.' });
  }
}

async function me(req, res) {
  res.json({ id: req.admin.id, username: req.admin.username });
}

module.exports = { login, me };
