const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    locationName:{
        type:String,
        required: true,
        unique: false,
    },

    longitude:{
        type:Number,
        required:true,
        validate: {
            validator: function (v) {
                return /^-?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(v);
            },
            message: props => `${props.value} is not a valid longitude!`
        },
    },

    latitude:{
        type:Number,
        required:true,
        validate: {
            validator: function (v) {
                return /^-?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(v);
            },
            message: props => `${props.value} is not a valid latitude!`
        },
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