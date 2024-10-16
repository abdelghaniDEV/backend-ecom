const mongoose = require('mongoose');


const categoryShema = mongoose.Schema({
    name: {
        type: String,
        required: [true , "required for category"],
        unique: [true , "please enter unique name"]
    },
    description: {
        type: String,
        required: false,
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


module.exports = mongoose.model("Category", categoryShema)