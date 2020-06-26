const Story = require("../models/story");

const fs = require("fs");
const path = require("path");

const ITEMS_PER_PAGE = 1;

exports.postStory = (req, res, next) => {
    if (!req.file) {
        const error = new Error("No Image Provided");
        error.statusCode = 422;
        throw error;
    }

    const photo = req.file.path.replace("\\", "/");

    const story = new Story({ image: photo, creator: req.userId });

    story
        .save()
        .then((resuult) => {
            res.status(201).json({
                message: "Story telah ditambahkan.",
                data: resuult,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
};

exports.deleteStory = (req, res, next) => {
    const storyId = req.params.storyId;
    Story.findById(storyId)
        .then((story) => {
            if (!story) {
                res.status(404).json({
                    message: "Tidak ada story.",
                });
            }
            console.log(story.image);
            clearImage(story.image);
            return Story.findByIdAndRemove(storyId);
        })
        .then((result) => {
            // console.log(result);
            res.status(200).json({
                message: "Story dihapus.",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.seeAllStory = (req, res, next) => {
    let totalItems;

    Story.find()
        .countDocuments()
        .then((items) => {
            totalItems = items;
            console.log(totalItems);
            return Story.find()
                .populate("creator", "_id name photo")
                .sort({ createdAt: -1 });
        })
        .then((result) => {
            if (totalItems < 1) {
                res.status(404).json({
                    message: "Story tidak ada.",
                });
            } else {
                res.status(200).json({
                    message: "Lihat semua story.",
                    data: result,
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.seeStory = (req, res, next) => {
    const page = +req.query.page;

    let totalItems;

    Story.find()
        .countDocuments()
        .then((numProducts) => {
            totalItems = numProducts;
            return Story.find()
                .populate("creator", "_id name")
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then((story) => {
            if (totalItems < 1) {
                res.status(400).json({
                    message: "Data tidak ada.",
                });
            } else {
                res.status(200).json({
                    message: "Story telah didapatkan.",
                    pages: {
                        totalItems: totalItems,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                    },
                    data: story,
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};