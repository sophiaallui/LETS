const express = require("express");
const router = express.Router();
const { ensureCorrectUserOrAdmin, ensureLoggedIn } = require("../middleware/auth");
const Goal = require("../models/goal");
const jsonschema = require("jsonschema");
const goalNewSchema = require("../schemas/goalNew.json");
const goalUpdateSchema = require("../schemas/goalUpdate.json");
const { BadRequestError } = require("../ExpressError");


// GET /goals/
// auth required: logged in.
// returns => { goals : [{ }] }
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const goals = await Goal.getAll();
    return res.json({ goals })
  } catch(e) {
    return next(e);
  }
});

// GET /goals/[username]
// auth required : admin or same as username
// returns => { goals : [{ }] };
router.get("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const goals = await Goal.getByUsername(req.params.username);
    return res.json({ goals })
  } catch(e) {
    return next(e);
  }
});

// POST /goals/[username]
// auth required: admin or same as username
router.post("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
     const validator = jsonschema.validate(req.body, goalNewSchema);
     if(!validator.valid) {
       const errors = validator.errors.map(e => e.stack);
       throw new BadRequestError(errors)
     }
     const { username } = req.params;
     const goal = await Goal.create(username, req.body);
     return res.json({ goal })
  } catch(e) {
    return next(e);
  }
});

// PUT /goals/[username]/[goalId]
// auth required : admin or same as username 
router.put("/:username/:id", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, goalUpdateSchema);
    if(!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new BadRequestError(errors);
    }
    const { id } = req.params;
    const goal = await Goal.update(id, req.body);
    return res.json({ goal })
  } catch(e) {
    return next(e);
  }
});

// DELETE /goals/[username]/[goalId]
// auth required : same as :username or admin
router.delete("/:username/:id", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Goal.delete(id);
    return res.json({ deleted : id });
  } catch(e) {
    return next(e);
  }
})


module.exports = router;