import mongoose from 'mongoose';
import { Appointment } from '../models/Appointment';
import { User } from '../models/User';
import { Pet } from '../models/Pet';
import { Service } from '../models/Service';

export async function seedAppointments() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        // Get existing data
        const users = await User.find({ role: 'client' });
        const pets = await Pet.find();
        const services = await Service.find();

        if (!users.length || !pets.length || !services.length) {
            throw new Error('Required data not found. Please run seedInitialData first.');
        }

        // Generate appointments for the next 30 days
        const appointments = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Create 2-3 appointments per day
            const appointmentsPerDay = Math.floor(Math.random() * 2) + 2;

            for (let j = 0; j < appointmentsPerDay; j++) {
                const hour = Math.floor(Math.random() * 8) + 9; // Between 9 AM and 5 PM
                const minute = Math.random() < 0.5 ? 0 : 30;

                const appointmentDate = new Date(date);
                appointmentDate.setHours(hour, minute, 0, 0);

                const user = users[Math.floor(Math.random() * users.length)];
                const pet = pets.find(p => p.owner.toString() === user._id.toString());
                const service = services[Math.floor(Math.random() * services.length)];

                if (pet) {
                    appointments.push({
                        date: appointmentDate,
                        user: user._id,
                        pet: pet._id,
                        service: service._id,
                        status: 'scheduled',
                        notes: `Appointment for ${pet.name}`
                    });
                }
            }
        }

        // Clear existing appointments
        await Appointment.deleteMany({});

        // Create new appointments
        await Appointment.insertMany(appointments);

        console.log('Appointments seeded successfully');
        return appointments;
    } catch (error) {
        console.error('Error seeding appointments:', error);
        throw error;
    }
} 