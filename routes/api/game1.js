const express = require('express');
const router = express.Router();

const Game1 = require('../../models/Game1');

// @route    GET api/games
// @desc     Get all games
// @access   Private
router.get('/',  async (req, res) => {
  try {
    // Sort by date to get the most recent post.
    const game1 = await Game1.aggregate([{ $sample: { size: 10 } }]);
    res.json(game1);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
