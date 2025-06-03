import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    FormGroup,
    Label,
    Col,
    Row,
} from 'reactstrap';
import {
    AvForm,
    AvGroup,
    AvInput,
    AvFeedback,
} from 'availity-reactstrap-validation';
import Select from 'react-select';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const AppointmentCreateModal = ({ isCreateOpen, close, onAppointmentCreated }) => {
    const [pets, setPets] = useState([]);
    const [formData, setFormData] = useState({
        pet_id: '',
        package_name: '',
        price: '',
        start_date: '',
        appointment_time: '',
        status: 'scheduled'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [petOptions, setPetOptions] = useState([]);

    const packageOptions = [
        { value: 'Basic Grooming', label: 'Basic Grooming ($50)', price: 50 },
        { value: 'Premium Grooming', label: 'Premium Grooming ($75)', price: 75 },
        { value: 'Daycare', label: 'Daycare ($30/day)', price: 30 },
        { value: 'Boarding', label: 'Boarding ($45/night)', price: 45 }
    ];

    useEffect(() => {
        if (isCreateOpen) {
            fetchPets();
            setFormData({
                pet_id: '',
                package_name: '',
                price: '',
                start_date: '',
                appointment_time: '',
                status: 'scheduled'
            });
        }
    }, [isCreateOpen]);

    const fetchPets = async () => {
        try {
            const response = await axios.get(`${API_URL}/pets`);
            const options = response.data.map(pet => ({
                value: pet._id,
                label: pet.pet_name + (pet.client_id ? ` (${pet.client_id.first_name} ${pet.client_id.last_name})` : ''),
            }));
            setPetOptions(options);
            setPets(response.data);
        } catch (err) {
            console.error('Error fetching pets:', err);
            setError('Failed to load pets');
        }
    };

    const handlePetChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            pet_id: selectedOption ? selectedOption.value : ''
        }));
    };

    const handlePackageChange = (selectedOption) => {
        if (!selectedOption) {
            setFormData(prev => ({
                ...prev,
                package_name: '',
                price: ''
            }));
            return;
        }

        let calculatedPrice = selectedOption.price;

        if (selectedOption.value === 'Daycare' || selectedOption.value === 'Boarding') {
            const startDate = formData.start_date ? new Date(formData.start_date) : null;
            const endDate = formData.end_date ? new Date(formData.end_date) : null;

            if (startDate && endDate) {
                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                calculatedPrice = calculatedPrice * days;
            }
        }

        setFormData(prev => ({
            ...prev,
            package_name: selectedOption.value,
            price: calculatedPrice
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: value
            };

            if ((name === 'start_date' || name === 'end_date') &&
                (prev.package_name === 'Daycare' || prev.package_name === 'Boarding')) {
                const packageOption = packageOptions.find(opt => opt.value === prev.package_name);
                if (packageOption && newData.start_date && newData.end_date) {
                    const startDate = new Date(newData.start_date);
                    const endDate = new Date(newData.end_date);
                    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                    newData.price = packageOption.price * days;
                }
            }

            return newData;
        });
    };

    const clear = () => {
        setFormData({
            pet_id: '',
            package_name: '',
            price: '',
            start_date: '',
            appointment_time: '',
            status: 'scheduled'
        });
    };

    const handleSubmit = async (event, errors) => {
        event.preventDefault();
        if (errors && errors.length > 0) return;

        setLoading(true);
        setError(null);

        try {
            // Create a new date object from the selected date
            const selectedDate = new Date(formData.start_date);
            // Adjust for timezone offset to ensure the date is preserved
            selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());

            const appointmentData = {
                ...formData,
                start_date: selectedDate.toISOString()
            };

            await axios.post(`${API_URL}/appointments`, appointmentData);
            onAppointmentCreated();
            clear();
            close();
        } catch (err) {
            console.error('Error creating appointment:', err);
            setError('Failed to create appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isCreateOpen} size={'xl'} backdrop={'static'} style={{ overflow: 'hidden' }} centered={true} keyboard={false}>
            <ModalHeader className='bg-primary text-white'>
                Add New Appointment
            </ModalHeader>
            <ModalBody>
                <AvForm className='p-4' onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Row>
                        <Col md={6}>
                            <AvGroup>
                                <Label for="pet_id">Pet</Label>
                                <Select
                                    id="pet_id"
                                    value={petOptions.find(option => option.value === formData.pet_id)}
                                    onChange={handlePetChange}
                                    options={petOptions}
                                    placeholder="Select a pet"
                                    className="react-select"
                                    classNamePrefix="select"
                                />
                                {!formData.pet_id && <div className="text-danger small">Please select a pet</div>}
                            </AvGroup>
                        </Col>
                        <Col md={6}>
                            <AvGroup>
                                <Label for="package_name">Package</Label>
                                <Select
                                    id="package_name"
                                    value={packageOptions.find(option => option.value === formData.package_name)}
                                    onChange={handlePackageChange}
                                    options={packageOptions}
                                    placeholder="Select a package"
                                    className="react-select"
                                    classNamePrefix="select"
                                />
                                {!formData.package_name && <div className="text-danger small">Please select a package</div>}
                            </AvGroup>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col md={4}>
                            <AvGroup>
                                <Label for="price">Price ($)</Label>
                                <AvInput
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                <AvFeedback>Price is required</AvFeedback>
                            </AvGroup>
                        </Col>
                        <Col md={4}>
                            <AvGroup>
                                <Label for="start_date">Date</Label>
                                <AvInput
                                    id="start_date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    type="date"
                                    required
                                />
                                <AvFeedback>Date is required</AvFeedback>
                            </AvGroup>
                        </Col>
                        <Col md={4}>
                            <AvGroup>
                                <Label for="appointment_time">Time</Label>
                                <AvInput
                                    id="appointment_time"
                                    name="appointment_time"
                                    value={formData.appointment_time}
                                    onChange={handleInputChange}
                                    type="time"
                                    required
                                />
                                <AvFeedback>Time is required</AvFeedback>
                            </AvGroup>
                        </Col>
                    </Row>
                    <FormGroup className='d-flex flex-row justify-content-center mt-4'>
                        <Button className="border-primary bg-primary text-white">Submit</Button>
                    </FormGroup>
                </AvForm>
            </ModalBody>
            <ModalFooter>
                <div className='w-100 d-flex flex-row justify-content-around'>
                    <Button
                        onClick={() => {
                            clear();
                            close();
                        }}
                        className="btn btn-warning text-white"
                    >
                        Close
                    </Button>
                    <Button onClick={clear} className="btn btn-secondary text-white">Clear</Button>
                </div>
            </ModalFooter>
        </Modal>
    );
};

export default AppointmentCreateModal; 