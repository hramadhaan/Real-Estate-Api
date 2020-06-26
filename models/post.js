const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    images: {
        type: [],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("post", postSchema);