const mongoose = require('mongoose');
const GuideSchema = new mongoose.Schema({
    guide_id: {
        type: String,
        required: true
    },
    tours:{
        assigned_tours:{
            type:Array,
            required:true
        },
        // type:Array,
        // required:true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    }
});

const Guide = mongoose.model('Guide', GuideSchema);

module.exports = Guide;