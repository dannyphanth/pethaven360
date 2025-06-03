const mongoose = require('mongoose');
const Client = require('./models/Client');
const Pet = require('./models/Pet');

const seedInitialData = async () => {
    try {
        // Clear existing data
        console.log('Clearing existing data...');
        await Client.deleteMany({});
        await Pet.deleteMany({});
        console.log('Existing data cleared');

        // Create sample clients
        const clients = [
            {
                first_name: 'John',
                last_name: 'Smith',
                email: 'john.smith@email.com',
                phone_number: '555-0123',
                address: '123 Main St',
                emergency_contact_name: 'Jane Smith',
                emergency_contact: '555-0124',
                vet_hospital: 'City Vet Clinic',
                vet_hospital_contact: '555-0125',
                joined_date: new Date(),
                status: 'active'
            },
            {
                first_name: 'Sarah',
                last_name: 'Johnson',
                email: 'sarah.j@email.com',
                phone_number: '555-0126',
                address: '456 Oak Ave',
                emergency_contact_name: 'Mike Johnson',
                emergency_contact: '555-0127',
                vet_hospital: 'Oak Veterinary Hospital',
                vet_hospital_contact: '555-0128',
                joined_date: new Date(),
                status: 'active'
            },
            {
                first_name: 'Michael',
                last_name: 'Brown',
                email: 'michael.b@email.com',
                phone_number: '555-0129',
                address: '789 Pine Rd',
                emergency_contact_name: 'Lisa Brown',
                emergency_contact: '555-0130',
                vet_hospital: 'Pine Animal Clinic',
                vet_hospital_contact: '555-0131',
                joined_date: new Date(),
                status: 'active'
            }
        ];

        console.log('Creating clients...');
        const createdClients = await Client.insertMany(clients);
        console.log(`Successfully created ${createdClients.length} clients`);

        // Create sample pets
        const pets = [
            {
                pet_name: 'Max',
                client_id: createdClients[0]._id,
                breed: 'Golden Retriever',
                age: 3,
                gender: 'Male',
                allergies: 'None',
                medical_condition: 'None',
                joined_date: new Date(),
                status: 'active'
            },
            {
                pet_name: 'Bella',
                client_id: createdClients[0]._id,
                breed: 'Siamese Cat',
                age: 2,
                gender: 'Female',
                allergies: 'None',
                medical_condition: 'None',
                joined_date: new Date(),
                status: 'active'
            },
            {
                pet_name: 'Charlie',
                client_id: createdClients[1]._id,
                breed: 'Labrador',
                age: 4,
                gender: 'Male',
                allergies: 'None',
                medical_condition: 'None',
                joined_date: new Date(),
                status: 'active'
            },
            {
                pet_name: 'Luna',
                client_id: createdClients[2]._id,
                breed: 'Persian Cat',
                age: 1,
                gender: 'Female',
                allergies: 'None',
                medical_condition: 'None',
                joined_date: new Date(),
                status: 'active'
            }
        ];

        console.log('Creating pets...');
        const createdPets = await Pet.insertMany(pets);
        console.log(`Successfully created ${createdPets.length} pets`);

        return { clients: createdClients, pets: createdPets };
    } catch (error) {
        console.error('Error seeding initial data:', error);
        throw error;
    }
};

module.exports = { seedInitialData }; 