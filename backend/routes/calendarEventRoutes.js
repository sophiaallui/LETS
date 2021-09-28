
// CREATE TABLE calendar_event (
//   id SERIAL PRIMARY KEY,
//   posted_by VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
//   event_title TEXT NOT NULL,
//   start_date DATE NOT NULL,
//   end_date DATE NOT NULL,
//   radios TEXT NOT NULL
// );

const router = require("express").Router();
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const CalendarEvent = require("../models/calendarEvent");

// GET
// get calendar-event/[username]
router.get("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { username } = req.params;
    const events = CalendarEvent.getAll(username);
    return res.json({ events })
  } 
  catch(e) {
    return next(e);
  }
});

// GET
// get by id 
// calendar-event/[id]
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const event = CalendarEvent.getById(req.params.id);
    return res.json({ event })
  }
  catch(e) {
    return next(e);
  }
});

router.post("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { username } = req.params;
    const event = CalendarEvent.create(username, req.body)
    return res.json({ event })
  } catch(e) {
    return next(e);
  }
});

module.exports = router;