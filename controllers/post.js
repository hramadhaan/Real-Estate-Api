const Posts = require("../models/post");
// const Images = require("../models/images");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const { postStory } = require("./story");

const ITEMS_PER_PAGE = 2;

exports.posting = (req, res, next) => {
    if (!req.files) {
        const error = new Error("No Image Provided");
        error.statusCode = 422;
        throw error;
    }

    const files = req.files;
    const title = req.body.title;

    let creator;

    var pathFiles = files.map((file) => file.path.replace("\\", "/"));

    const post = new Posts({
        title: title,
        creator: req.userId,
        images: pathFiles,
    });
    post
        .save()
        .then((result) => {
            return User.findById(req.userId);
        })
        .then((user) => {
            // console.log(user);
            creator = user;
            // if (user.creator.toString() !== req.userId) {
            //     res.status(403).json({
            //         message: "Not your Authorization!",
            //     });
            // }
            user.posts.push(post);
            return user.save();
        })
        .then((result) => {
            //   console.log(result);
            res.status(201).json({
                message: "Input berhasil.",
                data: post,
                creator: {
                    _id: creator._id,
                    name: creator.name,
                },
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const files = req.files;
    const title = req.body.title;

    var pathFiles = files.map((file) => file.path.replace("\\", "/"));

    Posts.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error("Could not find post.");
                error.statusCode = 400;
                throw error;
            }

            if (post.creator.toString() !== req.userId) {
                res.status(403).json({
                    message: "Not your Authorization!",
                });
            }

            if (pathFiles !== post.images) {
                deleteFiles(post.images, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("all files removed");
                    }
                });
            }
            post.title = title;
            post.images = pathFiles;
            return post.save();
        })
        .then((result) => {
            res.status(201).json({ message: "Post updated.", data: result });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Posts.findById(postId)
        .then((post) => {
            if (!post) {
                res.status(404).json({ message: "Postingan tidak ada" });
                next();
            } else {
                deleteFiles(post.images, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Has been removed!");
                    }
                });
            }
            // console.log(post.images);

            return Posts.findByIdAndRemove(postId);
        })
        .then((result) => {
            return User.findById(req.userId);
        })
        .then((user) => {
            user.posts.pull(postId);
            return user.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "Posting berhasil dihapus.",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

function deleteFiles(files, callback) {
    var i = files.length;
    // console.log(files);
    files.forEach(function(filepath) {
        fs.unlink(filepath, function(err) {
            i--;
            if (err) {
                callback(err);
                return;
            } else if (i <= 0) {
                callback(null);
            }
        });
    });
}

exports.searchPost = (req, res, next) => {
    const search = req.query.search;

    // Posts.find({ title: search })
    //     .then((result) => {
    //         res.status(200).json(result);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    let countItems;

    Posts.find({ title: search })
        .countDocuments()
        .then((items) => {
            countItems = items;
            return Posts.find({ title: search });
        })
        .then((result) => {
            if (countItems < 1) {
                res.status(404).json({ message: "Tidak ada data." });
            } else {
                res.status(200).json({ message: "Data didapatkan", data: result });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getPosting = (req, res, next) => {
    Posts.find()
        .populate("creator", "_id name photo")
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getAllPosting = (req, res, next) => {
    const page = +req.query.page;

    let totalItems;

    Posts.find()
        .countDocuments()
        .then((numProducts) => {
            totalItems = numProducts;
            return Posts.find()
                .populate("creator", "_id name")
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then((post) => {
            if (totalItems < 1) {
                res.status(400).json({
                    message: "Data tidak ada.",
                });
            } else {
                // res.status(200).json({
                //     message: "Posting telah didapatkan.",
                //     pages: {
                //         totalItems: totalItems,
                //         hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                //         hasPreviousPage: page > 1,
                //         nextPage: page + 1,
                //         previousPage: page - 1,
                //         lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                //     },
                //     data: post,
                // });

                res.status(200).json(post);
            }
        })
        .catch();
};