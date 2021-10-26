const router = require("express").Router();
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const db = require("../db");
const { BadRequestError } = require("../ExpressError");

// Get /notifications/:username
// get all notifications for :username order by most recent
router.get("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
   try {
      const notifications = await db.query(`SELECT * FROM notifications WHERE sent_to = $1 ORDER BY created_at DESC`, [req.params.username]);
      return res.json({ notifications : notifications.rows })
   } catch(e) {
      return next(e);
   }
});

// Post /notifications/:username
// post a notification 
router.post("/:username", ensureCorrectUserOrAdmin, async (req, res, next) => {
   try {
      const { username } = req.params;
      const { sentTo, notificationType } = req.body;
      const newNoti = await db.query(
         `INSERT 
            INTO notifications 
            (sent_by, sent_to, notification_type)
            VALUES 
            ($1, $2, $3) RETURNING *`,
            [username, sentTo, notificationType]

      );
      if(!newNoti.rows.length) {
         throw new BadRequestError()
      }
      return res.json({ notification : newNoti.rows[0] })
   } catch(e) {
      return next(e);
   }
});

// PUT /:username/:id
// update a notification (can only update the is_seen and seen_date field)
router.put("/:username/:id", ensureCorrectUserOrAdmin, async (req, res, next) => {
   try {
      const { username, id } = req.params;
      const { seenDate, isSeen } = req.body;
      const checkOwnership = await db.query(`SELECT sent_to FROM notifications WHERE id = $1`, [id]);
      const checkOwnershipResults = checkOwnership.rows[0];
      if(!checkOwnershipResults || checkOwnershipResults.sent_to !== username) {
         throw new BadRequestError()
      };
      const updatedNotificationResults = await db.query(
         `UPDATE notifications SET seen_date = $1, is_seen = $2 WHERE id = $3`, [seenDate, isSeen, id]
      )
      return res.json({ notification : updatedNotificationResults.rows[0] })
   } catch(e) {
      return next(e);
   }
})

router.delete("/:username/:id", ensureCorrectUserOrAdmin, async (req, res, next) = >{
   try {
      const { username, id } = req.params;
      
   } catch(e) {

   }
})

module.exports = router;