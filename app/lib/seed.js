import { connectToDatabase } from './mongodb';
import { User } from './models/User';
import { Pet } from './models/Pet';
import { Service } from './models/Service';
import { Appointment } from './models/Appointment';

const services = [
    {
        name: 'Basic Grooming',
        description: 'Bath, brush, and basic trim',
        duration: 60,
        price: 50
    },
    {
        name: 'Full Grooming',
        description: 'Complete grooming package including haircut',
        duration: 120,
        price: 80
    },
    {
        name: 'Nail Trim',
        description: 'Nail trimming and filing',
        duration: 30,
        price: 20
    }
];

const users = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        phone: '555-0123'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'customer',
        phone: '555-0124'
    }
];

const pets = [
    {
        name: 'Max',
        type: 'dog',
        breed: 'Golden Retriever',
        age: 3
    },
    {
        name: 'Luna',
        type: 'cat',
        breed: 'Siamese',
        age: 2
    }
];

export async function seedInitialData() {
    try {
        await connectToDatabase();

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Pet.deleteMany({}),
            Service.deleteMany({}),
            Appointment.deleteMany({})
        ]);

        // Create services
        const createdServices = await Service.insertMany(services);
        console.log('Services seeded successfully');

        // Create users
        const createdUsers = await User.insertMany(users);
        console.log('Users seeded successfully');

        // Create pets with owner references
        const petsWithOwners = pets.map((pet, index) => ({
            ...pet,
            owner: createdUsers[index]._id
        }));
        const createdPets = await Pet.insertMany(petsWithOwners);
        console.log('Pets seeded successfully');

        return {
            services: createdServices,
            users: createdUsers,
            pets: createdPets
        };
    } catch (error) {
        console.error('Error seeding initial data:', error);
        throw error;
    }
}

export async function seedAppointments(initialData) {
    try {
        const { services, users, pets } = initialData;

        // Generate appointments for the next 7 days
        const appointments = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Create 2 appointments per day
            for (let j = 0; j < 2; j++) {
                const hour = 9 + j * 2; // 9 AM and 11 AM
                const appointmentDate = new Date(date);
                appointmentDate.setHours(hour, 0, 0, 0);

                appointments.push({
                    date: appointmentDate,
                    user: users[j % users.length]._id,
                    pet: pets[j % pets.length]._id,
                    service: services[j % services.length]._id,
                    status: 'scheduled',
                    notes: `Appointment for ${pets[j % pets.length].name}`
                });
            }
        }

        await Appointment.insertMany(appointments);
        console.log('Appointments seeded successfully');
    } catch (error) {
        console.error('Error seeding appointments:', error);
        throw error;
    }
}

// Function to run all seeding
export async function seedAll() {
    try {
        const initialData = await seedInitialData();
        await seedAppointments(initialData);
        console.log('All data seeded successfully');
    } catch (error) {
        console.error('Error in seeding process:', error);
        throw error;
    }
} 