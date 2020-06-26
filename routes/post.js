const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const authentication = require("../middleware/authentication");

const router = express.Router();

const postController = require("../controllers/post");

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "images/post/");
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + file.originalname);
    },
});

router.post(
    "/post", [multer({ storage: fileStorage }).array("image", 4), authentication],
    postController.posting
);

router.get("/get-post", authentication, postController.getAllPosting);

router.post(
    "/post/:postId", [authentication, multer({ storage: fileStorage }).array("image", 4)],
    postController.updatePost
);

router.get(
    "/post/:postId", [authentication, multer({ storage: fileStorage }).array("image", 4)],
    postController.deletePost
);

router.get("/all-post", authentication, postController.getPosting);

router.get("/search-post", authentication, postController.searchPost);

module.exports = router;