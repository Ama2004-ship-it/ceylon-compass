require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function run() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';

  const passwordHash = await bcrypt.hash(password, 10);

  const [existing] = await pool.query('SELECT id FROM admins WHERE username = ?', [username]);

  if (existing.length > 0) {
    await pool.query('UPDATE admins SET password_hash = ? WHERE username = ?', [passwordHash, username]);
    console.log(`Updated password for existing admin "${username}".`);
  } else {
    await pool.query('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [username, passwordHash]);
    console.log(`Created new admin "${username}".`);
  }

  console.log(`Login with username="${username}" password="${password}"`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed to create admin:', err.message);
  process.exit(1);
});
