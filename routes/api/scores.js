const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Scores = require('../../models/Scores');

// @route    POST api/scores
// @desc     Create a game score
// @access   Private
router.post(
  '/',
  auth,
  [
    auth,
    [
      check('gameType', 'Game Type is required field').not().isEmpty(),
      check('userEmail', 'User Email is required field').not().isEmpty(),
      check('score', 'Score is required field').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newScores = new Scores({
        gameType: req.body.gameType,
        user: req.body.userEmail,
        score: req.body.score,
      });

      const post = await newScores.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/scores
// @desc     Get scores of a specific user and game type
// @access   Private
router.get('/', async (req, res) => {
  const gameType = req.query.gameType;
  const userEmail = req.query.userEmail;

  try {
    const scores = await Scores.find({ gameType: gameType, user: userEmail });
    const max = scores.reduce((max, obj) => max = Math.max(max, obj.score), 0);
    const average = scores.length === 0 ? 0 : scores.reduce((sum, obj) => sum += obj.score, 0) / scores.length;

    res.json({ max, average });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
