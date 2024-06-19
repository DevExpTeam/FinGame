const express = require('express');
const router = express.Router();

const AccountingItemSchema = require('../../models/AccountingItem');

// @route    GET api/games
// @desc     Get all games
// @access   Private
router.get('/',  async (req, res) => {
  const category = req.query.category;
  let result;

  try {
    // Sort by date to get the most recent post.
    if(category === "main") result = await AccountingItemSchema.aggregate([{ $sample: { size: 10 } }]);
    else result = await AccountingItemSchema.find({ answer: category });
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
