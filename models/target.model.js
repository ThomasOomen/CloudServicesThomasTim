const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TargetSchema = new Schema({
    name:{
        type:String,
        required: true
    },

    description:{
        type:String,
        required:true
    },

    picture:{
        type:String,
        required:true
    },

    hints:[{
        type: String,
        required: false
    }],

    score:[{
        type: Number,
        required: false
    }],

    created_at:{
        default: Date.now(),
        type: Date
    }
})

const TargetModel = mongoose.model('target', TargetSchema)
module.exports = TargetModel;