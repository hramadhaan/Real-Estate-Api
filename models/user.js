const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "post",
    }, ],
}, {
    timestamps: true,
});

module.exports = mongoose.model("user", userSchema);