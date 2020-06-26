const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema({
    image: {
        type: String,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
}, { timestamps: true });

storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model("story", storySchema);