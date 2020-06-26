const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

const storyController = require("../controllers/story");
const authentication = require("../middleware/authentication");
const { route } = require("./post");

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "images/story/");
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + file.originalname);
    },
});

router.post(
    "/post-story", [multer({ storage: fileStorage }).single("photo"), authentication],
    storyController.postStory
);

router.get(
    "/remove-story/:storyId", [authentication, multer({ storage: fileStorage }).single("photo")],
    storyController.deleteStory
);

router.get("/see-story", authentication, storyController.seeAllStory);

router.get("/detail-story", authentication, storyController.seeStory);

module.exports = router;