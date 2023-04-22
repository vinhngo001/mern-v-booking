const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
    boss: {
        type: String,
        require: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    availability: [],
    services: []
}, { timestamps: true });

module.exports = mongoose.model('staffs', StaffSchema);