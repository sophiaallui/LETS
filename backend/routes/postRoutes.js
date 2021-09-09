const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const { ensureCorrectUserOrAdmin, ensureLoggedIn } = require("../middleware/auth");

// POST /posts/:username
// Accepts { content }
// returns => { id, postedBy, content, createdAt }
router.post("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const newPost = await Post.create(req.params.username, req.body.content);
    return res.json({ post : newPost });
  } catch(e) {
    return next(e);
  }
});

// GET /posts/:postId
/**
 * returns => {
 *  id,
 *  
 * }
 */
// authorization required : logged in.
router.get("/:postId", ensureLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.getById(req.params.postId);
    return res.json({ post });
  } catch(e) {
    return next(e);
  }
});

// GET /posts
// returns => { posts : [] }
// authorization required : logged in.
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const posts = await Post.getAll();
    return res.json({ posts })
  } catch(e) {
    return next(e);
  }
});

// PATCH /posts/:username/:postId
// returns => { post : { ...updatedValues } };
// authorization required : admin or same-as-:username
router.patch("/:username/:postId", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { username, postId } = req.params;
    const post = await Post.update(username, postId, req.body);
    return res.json({ post });
  } catch(e) {
    return next(e);
  }
});

// DELETE /posts/:username/:postId
// returns => { deleted : postId }
// authorization required : admin or same-as-:username
router.delete("/:username/:postId", ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const { username, postId} = req.params;
    await Post.delete(username, postId);
    return res.json({ deleted : postId });
  } catch(e) {
    return next(e);
  }
});





module.exports = router;