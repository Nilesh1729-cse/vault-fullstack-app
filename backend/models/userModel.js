/**
 * User model: the only file that should write raw SQL for `users`.
 * Controllers call these functions instead of touching the pool
 * directly, so query logic stays in one place as features grow.
 */
const { pool } = require('../config/db');

const PUBLIC_FIELDS = 'id, name, email, role, is_active, created_at, updated_at';

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function create({ name, email, passwordHash }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return findById(result.insertId);
}

async function recordLogin(userId, { ipAddress, userAgent }) {
  await pool.query(
    'INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
    [userId, ipAddress || null, userAgent || null]
  );
}

module.exports = { findByEmail, findById, create, recordLogin };
