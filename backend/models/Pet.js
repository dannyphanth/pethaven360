const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    pet_name: String,
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    breed: String,
    age: Number,
    gender: String,
    allergies: String,
    medical_condition: String,
    joined_date: Date,
    status: String
});

module.exports = mongoose.model('Pet', petSchema); 