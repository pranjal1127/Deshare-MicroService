
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CreatorSchema = new Schema({
    address: {
        type: String,
        required: true,
        unique: false,
    },
    name: {
        type: String,
        required: true,
    },
    monthlyEarnings: {
        type: Number,
        required: true,
        default: 0,
    },
    monthId: {
        type: Number,
        required: true,
        default: 0,
    }
});


module.exports = mongoose.model("Creator", CreatorSchema);
