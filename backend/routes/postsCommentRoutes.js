const express = require("express");
const router = express.Router();
const {
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
} = require("../middleware/auth");
const PostComment = require("../models/postComment");
const SubComment = require("../models/subComment");
const jsonshema = require("jsonschema");
const newCommentSchema = require("../schemas/postsCommentNew.json");
const { BadRequestError } = require("../ExpressError");

// GET /comments
// Returns all comments
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const comments = await PostComment.getAllComments();
    return res.json({ comments });
  } catch (e) {
    return next(e);
  }
});

// GET /comments/:postId/
router.get("/:postId", ensureLoggedIn, async (req, res, next) => {
  try {
    const comments = await PostComment.getCommentsByPostId(req.params.postId);
    return res.json({ comments });
  } catch (e) {
    return next(e);
  }
});

// POST /comments/:postId/:username
// Adds comment to a post.
router.post(
  "/:postId/:username",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const validator = jsonshema.validate(req.body, newCommentSchema);
      if (!validator.valid) {
        const errors = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errors);
      }
      const { postId, username } = req.params;
      const comment = await PostComment.createComment(
        username,
        postId,
        req.body.content
      );
      return res.json({ comment });
    } catch (e) {
      return next(e);
    }
  }
);

// DELETE /comments/:postId/:username/:commentId
// Returns => { deleted : commentId }
router.delete(
  "/:postId/:username/:commentId",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const { postId, username, commentId } = req.params;
      await PostComment.deleteComment(postId, username, commentId);
      return res.json({ deleted: commentId });
    } catch (e) {
      return next(e);
    }
  }
);

// GET /comments/:postId/:username/:commentId/subcomments
// Get all nested comments
router.get(
  "/:postId/:username/:commentId/subcomments",
  ensureLoggedIn,
  async (req, res, next) => {
    try {
      const comments = await SubComment.getAll();
      return res.json({ comments });
    } catch (e) {
      return next(e);
    }
  }
);

// GET /comments/:postId/:username/:commentId/subcomments/:subcommentId
// GET single subcomment for the provided :subcommentId
router.get(
  "/:postId/:username/:commentId/subcomments/:subcommentId",
  ensureLoggedIn,
  async (req, res, next) => {
    try {
      const subComment = await SubComment.getOne(req.params.subcommentId);
      return res.json({ subComment });
    } catch (e) {
      return next(e);
    }
  }
);

// POST /comments/:postId/:username/:commentId/subcomments
// post a subcomment for the given :postId :username :commentId
router.post(
  "/:postId/:username/:commentId/subcomments",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const { postId, username, commentId } = req.params;
      const { content } = req.body;
      const subComment = await SubComment.create(
        postId,
        username,
        commentId,
        content
      );
      return res.json({ subComment });
    } catch (e) {
      return next(e);
    }
  }
);

// DELETE /comments/:postId/:username/:commentId/subcomments/:subcommentId
// DELETE a subcomment by id
router.delete(
  "/:postId/:username/:commentId/subcomments/:subcommentId",
  ensureCorrectUserOrAdmin,
  async (req, res, next) => {
    try {
      const id = req.params.subcommentId;
      await SubComment.deleteById(id);
      return res.json({ deleted: id });
    } catch (e) {
      return next(e);
    }
  }
);

module.exports = router;
