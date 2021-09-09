const express = require("express");
const router = express.Router();
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");

// POST /friends/:username/to/:username2
// Authorization required: admin or same-as:/:username
// Returns => { userFrom, userTo, requestTime, confirmed }
router.post("/:username/to/:username2", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    return next();
  } catch(e) {
    return next(e);
  }
});

module.exports = router;