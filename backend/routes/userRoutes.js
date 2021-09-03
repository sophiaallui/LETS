"use strict";
"use strict";

/** Routes for users. */
const jsonschema = require("jsonschema");
const express = require("express");
const router = express.Router();
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const User = require("../models/user");
/**
 * POST  / { user } => { user, token } 
 * Adds a new user. This is not the registration endpoint -- instead, this is 
 * only for admin users to add new users. The new user being added can be an admin.
 * 
 * This returns the newly created user and an authentication token for them:
 *  { user : { usernan}}
 */