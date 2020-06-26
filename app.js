// PACKAGE
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// FIle
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const storyRoutes = require("./routes/story");

// INISIASI
const app = express();

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "images");
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// app.use();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(userRoutes);
app.use(postRoutes);
app.use(storyRoutes);

mongoose
    .connect(
        "mongodb+srv://hramadhaan:Hanief579@cluster-hanif-xi135.gcp.mongodb.net/real-estate", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then((result) => {
        console.log("Connected !");
        app.listen(8080);
    })
    .catch((err) => {
        console.log(err);
    });