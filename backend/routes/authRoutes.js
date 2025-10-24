const express = require('express');
const router = express.Router();

// Temporary test routes — just to make sure your server runs properly
router.post('/register', (req, res) => {
  res.json({ message: 'Register route working!' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login route working!' });
});

module.exports = router;
 