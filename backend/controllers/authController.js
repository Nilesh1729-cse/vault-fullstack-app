/**
 * Auth controller: request/response handling for register, login, and
 * "who am I". Business logic stays thin here and delegates to the
 * model + utils, so it's easy to add e.g. password reset later by
 * adding one more exported function + one more route.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function sanitizeUser(user) {
  const { password_hash, ...safe } = user;
  return safe;
}

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await userModel.create({ name, email, passwordHash });
    const token = signToken(user);

    return res.status(201).json({ message: 'Account created.', token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findByEmail(email);
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    await userModel.recordLogin(user.id, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    const token = signToken(user);
    return res.json({ message: 'Logged in.', token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    // req.user is set by the authMiddleware after verifying the JWT
    const user = await userModel.findById(req.user.sub);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
