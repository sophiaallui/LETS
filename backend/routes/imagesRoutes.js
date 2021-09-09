const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../knexDb");
const { NotFoundError } = require("../ExpressError");
const { ensureLoggedIn } = require("../middleware/auth");
const imageUpload = multer({ dest : "images" })


router.post("/", ensureLoggedIn, imageUpload.single("image"), async (req, res, next) => {
   try {
      const { filename, mimetype, size } = req.file;
      const filepath = req.file.path;
      db.insert({
        filename,
        filepath,
        mimetype,
        size
      })
      .into("image_files")
      .then(() => res.json({ success : true, filename }))
      .catch(e => res.json({ 
        success : false, 
        message : "upload failed", 
        stack : e.stack
      }));
    } 
   catch(e) {
     return next(e);
   }
});

router.get("/:filename", async (req, res, next) => {
  try {
    const { filename } = req.params;
    db.select("*")
      .from("image_files")
      .where({ filename })
      .then(images => {
        if(images[0]) {
          const dirname = path.resolve();
          const fullFilePath = path.join(dirname, images[0].filepath);
          return res.type(images[0].mimetype).sendFile(fullFilePath);
        } else {
          throw new NotFoundError('Filename not found')
        }
      })
  } catch(e) {
    return next(e);
  }
});

module.exports = router;