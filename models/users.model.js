const mongoose = require("mongoose");

const UsreShema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true , "this email is already in existence"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    image: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("User", UsreShema)