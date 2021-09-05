"use strict";

/** Routes for users. */
const jsonschema = require("jsonschema");

const express = require("express");
const {
  ensureCorrectUserOrAdmin,
  ensureAdmin,
  ensureLoggedIn,
} = require("../middleware/auth");
const { BadRequestError } = require("../ExpressError");

const User = require("../models/user");

const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userRegisterSchema.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const userMeasurementSchema = require("../schemas/userMeasurementsNew.json");
const router = express.Router();

/**
 * POST  / { user } => { user, token }
 * Adds a new user. This is not the registration endpoint -- instead, this is
 * only for admin users to add new users. The new user being added can be an admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  { user : { username, firstName, lastName, email, isAdmin}, token }
 * Authorization required : admin
 */
router.post("/", ensureAdmin, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (e) {
    return next(e);
  }
});

/** GET / => { users : [{ username, email, firstName, lastName, isAdmin }, ... ] }
 * Returns list of all users.
 * Authorization required : admin
 */
router.get("/", ensureAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (e) {
    return next(e);
  }
});

/** GET /[username] => { user }
 * Returns { username, email, firstName, lastName, isAdmin }
 * Authorization required : admin or same-as-:username
 */
router.get("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (e) {
    return next(e);
  }
});

/** PATCH /[username] { user } => { user }
 *  Data can include:
 *    { firstName, lastName, password, email }
 *  Returns { user : username, email, firstName, lastName, isAdmin }
 * Authorization required : admin or same-as-:username
 */
router.patch("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const validatator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validatator.valid) {
      const errs = validatator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (e) {
    return next(e);
  }
});

/** DELETE /[username] => { deleted : username }
 * Authorization required : admin or same-user-as:username
 */
router.delete(
  "/:username",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (e) {
      return next(e);
    }
  }
);

/** ////////////////////////////////////////////// MEASUREMENTS ///////////////
 *  //////////////////////////////////////////////////////////////////////////
 */

/** POST /[username]/measurements
 *  Accepts => {
 *     heightInInches,
 *     weightInPounds,
 *     armsInInches,
 *     legsInInches,
 *     waistInInches,
 * }
 * Authorization required : admin or same-user-as:username
 * Returns { measurements : { id, createdBy, heightInInches, weightInPounds, armsInInches, .. } }
 */
router.post(
  "/:username/measurements",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const validator = jsonschema.validate(req.body, userMeasurementSchema);
      if (!validator.valid) {
        const errors = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errors);
      }
      const measurements = await User.postMeasurements(
        req.params.username,
        req.body
      );
      return res.json({ measurements });
    } catch (e) {
      return next(e);
    }
  }
);

// DELETE /:username/measurements/:measurementId
// returns => ({ deleted : measurementId });
// Authorization required: Admin or same-as-:username
router.delete(
  "/:username/measurements/:measurementId",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const { username, measurementId } = req.params;
      await User.deleteMeasurements(username, measurementId);
      return res.json({ deleted: measurementId });
    } catch (e) {
      return next(e);
    }
  }
);

// Returns => { measurements : [{ id, createdBy, heightInInches, ... }, ] }
// Notfound error if user doesn't have any measurements.
// Authorization required: must be signed in.
router.get(
  "/:username/measurements",
  ensureLoggedIn,
  async (req, res, next) => {
    try {
      const { username } = req.params;
      const measurements = await User.getMeasurements(username);
      return res.json({ measurements });
    } catch (e) {
      return next(e);
    }
  }
);

// GET /:username/measurements/:measurementId
// Returns => { measurement : { id, createdBy, heightInInches, weightInPounds, ...} }
// Authorization required: must be signed-in
router.get(
  "/:username/measurements/:measurementId",
  ensureLoggedIn,
  async (req, res, next) => {
    try {
      const { username, measurementId } = req.params;
      const measurement = await User.getMeasurement(username, measurementId);
      return res.json({ measurement });
    } catch (e) {
      return next(e);
    }
  }
);

// PUT /:username/measurements/:measurementId
// Returns => { measurement : { UPDATED VALUES } }
// Authorization required : admin or same-as-:username
router.put(
  "/:username/measurements/:measurementId",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const validator = jsonschema.validate(req.body, userMeasurementSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const { username, measurementId } = req.params;
      const measurement = await User.updateMeasurement(
        username,
        req.body,
        measurementId
      );
      return res.json({ measurement });
    } catch (e) {
      return next(e);
    }
  }
);

module.exports = router;
