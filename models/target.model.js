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

    }],
    score:[{

    }],
    created_at:{

    }
})

const TargetModel = mongoose.model('Target', TargetSchema)
module.exports = TargetModel;