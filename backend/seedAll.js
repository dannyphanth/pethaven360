const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://dannyphanth:Danietlio346!@cluster0.fggbvdd.mongodb.net/pethaven';

// Import seeding functions
const { seedInitialData } = require('./seedInitialData');
const { seedAppointments } = require('./seedData');

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');

    try {
        // Run initial data seeding
        console.log('Starting initial data seeding...');
        await seedInitialData();
        console.log('Initial data seeding completed successfully');

        // Run appointment seeding
        console.log('Starting appointment seeding...');
        await seedAppointments();
        console.log('Appointment seeding completed successfully');

        console.log('All seeding completed successfully');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        process.exit();
    }
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}); 