const mongoose = require('mongoose');
const TravellerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    count:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    tour_id:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});

const Traveller = mongoose.model('Traveller', TravellerSchema);

module.exports = Traveller;