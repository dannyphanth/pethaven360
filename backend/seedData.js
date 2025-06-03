const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const Pet = require('./models/Pet');

const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * (17 - 9) + 9); // Between 9 AM and 5 PM
    const minutes = Math.random() < 0.5 ? '00' : '30';
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const seedAppointments = async () => {
    try {
        // Clear existing appointments
        console.log('Clearing existing appointments...');
        await Appointment.deleteMany({});
        console.log('Existing appointments cleared');

        // Get all active pets
        console.log('Fetching active pets...');
        const pets = await Pet.find({ status: 'active' }).populate('client_id');
        if (pets.length === 0) {
            throw new Error('No pets found. Please seed pets first.');
        }
        console.log(`Found ${pets.length} active pets`);

        const packages = [
            { name: 'Basic Grooming', price: 50 },
            { name: 'Premium Grooming', price: 75 },
            { name: 'Daycare', price: 30 },
            { name: 'Boarding', price: 45 }
        ];

        const appointments = [];
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30); // Generate appointments for next 30 days

        console.log('Generating appointments...');
        // Generate 2-4 appointments per day
        for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
            const appointmentsPerDay = Math.floor(Math.random() * 3) + 2; // 2-4 appointments per day

            for (let i = 0; i < appointmentsPerDay; i++) {
                const randomPet = pets[Math.floor(Math.random() * pets.length)];
                const randomPackage = packages[Math.floor(Math.random() * packages.length)];

                const appointmentDate = new Date(d);
                const appointmentTime = generateRandomTime();

                appointments.push({
                    pet_id: randomPet._id,
                    package_name: randomPackage.name,
                    price: randomPackage.price,
                    start_date: appointmentDate,
                    appointment_time: appointmentTime,
                    status: 'scheduled'
                });
            }
        }

        console.log(`Creating ${appointments.length} appointments...`);
        const createdAppointments = await Appointment.insertMany(appointments);
        console.log(`Successfully created ${createdAppointments.length} appointments`);

        return createdAppointments;
    } catch (error) {
        console.error('Error seeding appointments:', error);
        throw error;
    }
};

module.exports = { seedAppointments }; 