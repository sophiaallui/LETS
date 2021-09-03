"use strict";
/** Routes for authentication */
const jsonschema = require("jsonschema");
const express = require('express');
const router = express.Router();

const User = require("../models/user");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegisterSchema.json");
const { BadRequestError } = require("../ExpressError");
const { createToken } = require("../helpers/tokens");


/**
 * POST /auth/token : { username, password } => { token }
 * Returns JWTT token which can be used to authenticate further requests.
 * Authorization required : none
 */
router.post("/token", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if(!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new BadRequestError(errors);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } 
  catch(e) {
    return next(e);
  }
});

/**
 * POST /auth/register : {user} => { token }
 * user must include { username, firstName, lastName, password, email }
 * Returns JWT token which can be used to authenticate further requests.
 * Authorization required : none
 */
router.post("/register", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if(!validator.valid) {
      const errors = validator.errors.map(e => e.stack);
      throw new BadRequestError(errors);
    }

    const newUser = await User.register({ ...req.body, isAdmin : false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch(e) {
    return next(e);
  }
});

module.exports = router;