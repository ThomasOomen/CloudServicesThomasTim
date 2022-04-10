const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playedTargetSchema = new Schema({
    picture: {
        required: true,
        type: String,
    },
    created_at: {
        default: Date.now(),
        type: Date,
    },
    completed:{
        type: Boolean,
        default: false,
    },
    target:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'target',
        required: true,
    },
    scorePercentage:{
        type: Number,
        required: false,
    },
    score:[{
        type: Object,
        required: false,
    }],
});

const playedTargetModel = mongoose.model('playedTarget', playedTargetSchema)
module.exports = playedTargetModel;
module.exports.get = (callback, limit) => {
    playedTarget.find(callback).limit(limit);
};