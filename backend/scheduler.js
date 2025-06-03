const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const Pet = require('./models/Pet');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://dannyphanth:Danietlio346!@cluster0.fggbvdd.mongodb.net/pethaven';

const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * (17 - 9) + 9); // Between 9 AM and 5 PM
    const minutes = Math.random() < 0.5 ? '00' : '30';
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const addNewDayAppointments = async () => {
    try {
        // Get all active pets
        const pets = await Pet.find({ status: 'active' }).populate('client_id');
        if (pets.length === 0) {
            console.log('No pets found. Please seed pets first.');
            return;
        }

        const packages = [
            { name: 'Basic Grooming', price: 50 },
            { name: 'Premium Grooming', price: 75 },
            { name: 'Daycare', price: 30 },
            { name: 'Boarding', price: 45 }
        ];

        // Calculate the date 30 days from now
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);

        // Generate 2-4 appointments for this future date
        const appointmentsPerDay = Math.floor(Math.random() * 3) + 2;
        const appointments = [];

        for (let i = 0; i < appointmentsPerDay; i++) {
            const randomPet = pets[Math.floor(Math.random() * pets.length)];
            const randomPackage = packages[Math.floor(Math.random() * packages.length)];
            const appointmentTime = generateRandomTime();

            appointments.push({
                pet_id: randomPet._id,
                package_name: randomPackage.name,
                price: randomPackage.price,
                start_date: futureDate,
                appointment_time: appointmentTime,
                status: 'scheduled'
            });
        }

        await Appointment.insertMany(appointments);
        console.log(`Successfully added ${appointmentsPerDay} appointments for ${futureDate.toDateString()}`);
    } catch (error) {
        console.error('Error adding new appointments:', error);
    }
};

// Connect to MongoDB and start the scheduler
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');

    // Run immediately on startup
    addNewDayAppointments();

    // Then run every 24 hours
    setInterval(addNewDayAppointments, 24 * 60 * 60 * 1000);

    console.log('Scheduler started - will add new appointments daily');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}); 