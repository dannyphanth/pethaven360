const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    pet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
    package_name: String,
    price: Number,
    start_date: Date,
    appointment_time: String,
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema); 