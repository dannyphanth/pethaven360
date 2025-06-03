import mongoose from 'mongoose';
import { User } from '../models/User';
import { Pet } from '../models/Pet';
import { Service } from '../models/Service';
import { Appointment } from '../models/Appointment';

export async function seedInitialData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing data
        await User.deleteMany({});
        await Pet.deleteMany({});
        await Service.deleteMany({});
        await Appointment.deleteMany({});

        // Create users
        const users = await User.create([
            {
                name: 'John Doe',
                email: 'john@example.com',
                role: 'client',
                phone: '123-456-7890'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'client',
                phone: '098-765-4321'
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'admin',
                phone: '555-555-5555'
            }
        ]);

        // Create pets
        const pets = await Pet.create([
            {
                name: 'Max',
                type: 'dog',
                breed: 'Golden Retriever',
                age: 3,
                owner: users[0]._id
            },
            {
                name: 'Luna',
                type: 'cat',
                breed: 'Siamese',
                age: 2,
                owner: users[1]._id
            }
        ]);

        // Create services
        const services = await Service.create([
            {
                name: 'Basic Grooming',
                description: 'Basic grooming service for pets',
                duration: 60,
                price: 50
            },
            {
                name: 'Full Grooming',
                description: 'Complete grooming service including haircut',
                duration: 120,
                price: 100
            },
            {
                name: 'Nail Trimming',
                description: 'Nail trimming service',
                duration: 30,
                price: 25
            }
        ]);

        console.log('Initial data seeded successfully');
        return { users, pets, services };
    } catch (error) {
        console.error('Error seeding initial data:', error);
        throw error;
    }
} 