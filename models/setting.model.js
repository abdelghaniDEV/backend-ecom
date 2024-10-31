const mongoose = require('mongoose')

const settingsShema = mongoose.Schema({
    storeName : {type: 'string' , required : true},
    storeEmail : {type: 'string' , required : true},
    storePhone : {type: 'string' , required : false},
    storeDescription : {type: 'string' , required :false},
    storeLogo : {type: 'string' , required : false},
    storeIcon : {type: 'string' , required : false},
    facebookLink : {type: 'string' , required : false},
    twitterLink : {type: 'string' , required : false},
    instagramLink : {type: 'string' , required : false},
    tiktokLink : {type: 'string' , required : false},
})

module.exports = mongoose.model("Settings", settingsShema)