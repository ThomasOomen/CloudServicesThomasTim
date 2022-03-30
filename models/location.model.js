const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    locationName:{
        type:String,
        required: true
    },
    longitude:{
        type:String,
        required:true
    },
    latitude:{

    },
    range:[{

    }],
    targets:[{

    }],
})

const locationModel = mongoose.model('location', LocationSchema)
module.exports = locationModel;