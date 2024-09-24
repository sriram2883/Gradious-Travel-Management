const mongoose = require('mongoose');
const TourSchema = new mongoose.Schema({
    tour_id: {
        type: String,
        required: true
    },
    details:{
        type:Object,
        required:true
    }
});

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;