import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
serviceSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema); 