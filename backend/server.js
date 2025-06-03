const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models
const Client = require('./models/Client');
const Pet = require('./models/Pet');
const Appointment = require('./models/Appointment');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = 'mongodb+srv://dannyphanth:Danietlio346!@cluster0.fggbvdd.mongodb.net/pethaven';
console.log('Attempting to connect to MongoDB Atlas...');

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Successfully connected to MongoDB Atlas');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Function to update appointment statuses
const updateAppointmentStatuses = async () => {
    try {
        const now = new Date();
        const appointments = await Appointment.find({ status: 'scheduled' });

        for (const appointment of appointments) {
            const appointmentDateTime = new Date(appointment.start_date);
            // Set the time from the appointment_time string
            if (appointment.appointment_time) {
                const [hours, minutes] = appointment.appointment_time.split(':');
                appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            }

            // Only mark as completed if both date and time have passed
            if (appointmentDateTime < now) {
                await Appointment.findByIdAndUpdate(appointment._id, { status: 'completed' });
            }
        }
    } catch (err) {
        console.error('Error updating appointment statuses:', err);
    }
};

// Dashboard route
app.get('/dashboard/stats', async (req, res) => {
    try {
        // Get today's date in UTC
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get first day of current month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Get date 7 days from now
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        // Fetch all required data
        const [
            activePets,
            activeClients,
            todayAppointments,
            monthlyAppointments,
            upcomingAppointments
        ] = await Promise.all([
            Pet.countDocuments({ status: 'active' }),
            Client.countDocuments({ status: 'active' }),
            Appointment.countDocuments({
                start_date: {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                },
                status: 'scheduled'
            }),
            Appointment.find({
                start_date: { $gte: firstDayOfMonth },
                status: 'completed'
            }),
            Appointment.countDocuments({
                start_date: {
                    $gt: today,
                    $lte: nextWeek
                },
                status: 'scheduled'
            })
        ]);

        // Calculate monthly revenue
        const monthlyRevenue = monthlyAppointments.reduce((total, app) => total + (app.price || 0), 0);

        res.json({
            activePets,
            activeClients,
            todayAppointments,
            monthlyRevenue,
            upcomingAppointments
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json('Error: ' + err.message);
    }
});

// Client routes
app.get('/clients', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

app.post('/clients', async (req, res) => {
    try {
        const newClient = new Client(req.body);
        await newClient.save();
        res.status(201).json('Client added successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

app.patch('/clients/:id', async (req, res) => {
    try {
        await Client.findByIdAndUpdate(req.params.id, req.body);
        res.json('Client updated successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

app.delete('/clients/:id', async (req, res) => {
    try {
        const clientId = req.params.id;

        // Find all pets belonging to this client
        const pets = await Pet.find({ client_id: clientId });

        // Delete all appointments for each pet
        for (const pet of pets) {
            await Appointment.deleteMany({ pet_id: pet._id });
        }

        // Delete all pets belonging to this client
        await Pet.deleteMany({ client_id: clientId });

        // Finally, delete the client
        await Client.findByIdAndDelete(clientId);

        res.json('Client and associated pets and appointments deleted successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Pet routes
app.get('/pets', async (req, res) => {
    try {
        const pets = await Pet.find().populate('client_id');
        res.json(pets);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

app.post('/pets', async (req, res) => {
    try {
        const newPet = new Pet(req.body);
        await newPet.save();
        res.status(201).json('Pet added successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

app.patch('/pets/:id', async (req, res) => {
    try {
        console.log('Updating pet with ID:', req.params.id);
        console.log('Update data:', req.body);

        // Create update object without client_id first
        const updateData = {
            pet_name: req.body.pet_name,
            breed: req.body.breed,
            age: req.body.age,
            gender: req.body.gender,
            allergies: req.body.allergies || '',
            medical_condition: req.body.medical_condition || '',
            status: req.body.status
        };

        // Only add client_id to update if it's provided and valid
        if (req.body.client_id && mongoose.Types.ObjectId.isValid(req.body.client_id)) {
            updateData.client_id = req.body.client_id;
        }

        const updatedPet = await Pet.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPet) {
            return res.status(404).json('Pet not found');
        }

        res.json('Pet updated successfully');
    } catch (err) {
        console.error('Error updating pet:', err);
        res.status(400).json('Error: ' + err.message);
    }
});

app.delete('/pets/:id', async (req, res) => {
    try {
        await Pet.findByIdAndDelete(req.params.id);
        res.json('Pet deleted successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Appointment routes
app.get('/appointments', async (req, res) => {
    try {
        // Update appointment statuses before fetching
        await updateAppointmentStatuses();

        const appointments = await Appointment.find()
            .populate({
                path: 'pet_id',
                populate: {
                    path: 'client_id'
                }
            });
        res.json(appointments);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

app.post('/appointments', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(201).json('Appointment added successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

app.patch('/appointments/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, req.body);
        res.json('Appointment updated successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

app.delete('/appointments/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json('Appointment deleted successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Status update routes
app.patch('/clients/deactivate/:id', async (req, res) => {
    try {
        await Client.findByIdAndUpdate(req.params.id, { status: 'inactive' });
        res.json('Client deactivated successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

app.patch('/clients/reactivate/:id', async (req, res) => {
    try {
        await Client.findByIdAndUpdate(req.params.id, { status: 'active' });
        res.json('Client reactivated successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Add this new endpoint for the cron job
app.post('/api/generate-appointments', async (req, res) => {
    try {
        // Get all active pets
        const pets = await Pet.find({ status: 'active' }).populate('client_id');
        if (pets.length === 0) {
            return res.status(400).json('No pets found');
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
            const appointmentTime = `${Math.floor(Math.random() * (17 - 9) + 9).toString().padStart(2, '0')}:${Math.random() < 0.5 ? '00' : '30'}`;

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
        res.json(`Successfully added ${appointmentsPerDay} appointments for ${futureDate.toDateString()}`);
    } catch (err) {
        console.error('Error generating appointments:', err);
        res.status(500).json('Error: ' + err.message);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}); 