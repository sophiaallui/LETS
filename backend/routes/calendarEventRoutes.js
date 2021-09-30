
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
const jsonSchema = require("jsonschema");
const CalendarEvent = require("../models/calendarEvent");
const calendarEventNewSchema = require("../schemas/calendarEventNew.json");
const { BadRequestError } = require("../ExpressError");

// GET
// get calendar-event/[username]
// Get all calendar events by username
router.get("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { username } = req.params;
    const events = await CalendarEvent.getAll(username);
    return res.json({ events })
  } 
  catch(e) {
    return next(e);
  }
});

// GET
// get a single event by id 
// calendar-event/id/[id]
router.get("/id/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const event = await CalendarEvent.getById(req.params.id);
    return res.json({ event })
  }
  catch(e) {
    return next(e);
  }
});


// POST
// create new calendar event
router.post("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const validator = jsonSchema.validate(req.body, calendarEventNewSchema);
    if(!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new BadRequestError(errors)
    }
    const { username } = req.params;
    const event = await CalendarEvent.create(username, req.body)
    return res.json({ event })
  } catch(e) {
    return next(e);
  }
});

module.exports = router;