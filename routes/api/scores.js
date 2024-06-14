const express = require('express');
const router = express.Router();

const Scores = require('../../models/Scores');

// @route    GET api/games
// @desc     Get all games
// @access   Private
router.get('/',  async (req, res) => {
  const gameType = req.query.gameType;
  const userEmail = req.query.userEmail;

  try {
    // Sort by date to get the most recent post.
    const scores = await Scores.find({ gameType: gameType, user: userEmail });
    const sum = scores.reduce((sum, obj) => sum += obj.score, 0);
    const average = scores.length === 0 ? 0 : sum / scores.length;

    res.json({ sum, average });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
