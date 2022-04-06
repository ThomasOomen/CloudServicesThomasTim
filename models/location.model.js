const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import { validationLatitudeLongitude } from "validation-latitude-longitude";

const LocationSchema = new Schema({
    locationName:{
        type:String,
        required: true,
        unique: true,
    },

    longitude:{
        type:Number,
        required:true,
        validate: {
            validator: function(v) {
                return validationLatitudeLongitude.longitude(v);
            },
            message: result => `${result.value} is not valid`
        }
    },

    latitude:{
        type:Number,
        required:true,
        validate: {
            validator: function(v) {
                return validationLatitudeLongitude.latitude(v);
            },
            message: result => `${result.value} is not valid`
        }
    },

    range:{
        type: Number,
        required: true,
    },

    targets:[{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }],
})

const locationModel = mongoose.model('location', LocationSchema)
module.exports = locationModel;