const mongoose = require('mongoose');

const playedTargetSchema = mongoose.Schema({
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
// Export target model
const playedTarget = mongoose.model('playedTarget', playedTargetSchema);
module.exports = playedTarget;
module.exports.get = (callback, limit) => {
    playedTarget.find(callback).limit(limit);
};
