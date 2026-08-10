/**
 * express-validator rule sets. Keeping these separate from routes
 * makes it easy to reuse or extend (e.g. add a "change password"
 * validator later) without touching route wiring.
 */
const { body } = require('express-validator');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required.')
    .isLength({ max: 100 }).withMessage('Name is too long.'),
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

module.exports = { registerRules, loginRules };
