
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    address: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    viewToken: {
        type: Number,
        required: true,
        default: 0,
    },
    lastUpdate: {
        type: Number,
        required: true,
        default: 0,
    }
});


module.exports = mongoose.model("User", UserSchema);
