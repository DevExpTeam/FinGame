const express = require('express');
const router = express.Router();

const AccountingItemSchema = require('../../models/AccountingItem');
const TAccountSchema = require('../../models/TAccount');

// @route    GET api/games
// @desc     Get all games
// @access   Private
router.get('/',  async (req, res) => {
  const category = req.query.category;
  let result;

  try {
    // Sort by date to get the most recent post.
    if(category === "main") {
      let results = await TAccountSchema.aggregate([{ $sample: { size: 1 } }]);
      result = results[0];
    }
    else result = await AccountingItemSchema.find({ answer: category });
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
