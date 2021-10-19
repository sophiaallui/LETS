const express = require("express");
const router = express.Router();
const UserFriend = require("../models/userFriend");
const { ensureCorrectUserOrAdmin, ensureLoggedIn } = require("../middleware/auth");
const db = require("../db");


// GET friends/[username]
// gets a list of :username's friends
// auth required : loggedin users
// returns => { friends : [ ] }
router.get("/:username", ensureLoggedIn, async (req, res, next) => {
  try {
    const friends = await UserFriend.getAllFrom(req.params.username);
    return res.json({ friends })
  } catch(e) {
    return next(e);
  }
})

// GET friends/[username]/pending
// GETS a list of friend requests that are pending :username's confirmation
// returns => { requests : [ ] }
// auth required : same as :username or admin
router.get("/:username/pending", async (req, res, next) => {
  try {
    const { username } = req.params;
    const requests = await UserFriend.getAllPending(username);
    return res.json({ requests  })
  } catch(e) {
    return next(e);
  }
})

// get friends/[username]/sent
// gets a list of users that :username sent a friend req to.
router.get("/:username/sent", async (req, res, next) => {
  try {
    const { username } = req.params;
    const byMe = await UserFriend.getAllBy(username)
    return res.json({ myRequests : byMe })
  }
  catch(e) {
    return next(e);
  }
})

// POST friends/[username]/to/[username2]
// Sending a friend request from same-as-:username to username2
router.post("/:username/to/:username2", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
     const { username, username2 } = req.params;
     const friendRequest = await UserFriend.sendFriendRequest(username, username2);
     return res.json({ friendRequest })
  } catch(e) {
    return next(e);
  }
});

// PUT friends/[username]/from/[username2]
// Confirming friend request from username2 to logged in user
router.put("/:username/from/:username2", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { username, username2 } = req.params;
    const friendRequest = await UserFriend.confirmFriendRequest(username2, username);
    return res.json({ friendRequest })
  } catch(e) {
    return next(e)
  }
});

// delete friend request from logged-in user to target user
router.delete("/:username/to/:username2", ensureCorrectUserOrAdmin, async (req, res, next) =>{
  try {
    const { username, username2 } = req.params;
    const request = await UserFriend.cancelFriendRequest(username, username2);
    return res.json({ request });
  } catch(e) {
    return next(e);
  }
})

module.exports = router;