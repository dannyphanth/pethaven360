const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    address: String,
    phone_number: String,
    emergency_contact_name: String,
    emergency_contact: String,
    vet_hospital: String,
    vet_hospital_contact: String,
    joined_date: Date,
    status: String
});

module.exports = mongoose.model('Client', clientSchema); 