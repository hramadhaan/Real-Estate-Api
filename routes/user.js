// PACKAGE
const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// FILE
// const User = require("../models/user");

// INISIASI
const router = express.Router();

const userController = require("../controllers/user");
const authentication = require("../middleware/authentication");

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "images/profile/");
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + file.originalname);
    },
});

router.post(
    "/register",
    multer({ storage: fileStorage }).single("photo"),
    userController.register
);

router.post("/login", userController.login);

router.get("/profile/:id", authentication, userController.profile);

module.exports = router;