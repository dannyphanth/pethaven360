import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    Button,
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

const AppointmentEditModal = ({ isEditOpen, close, data, onAppointmentUpdated }) => {
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [formData, setFormData] = useState({
        pet_id: '',
        package_name: '',
        price: '',
        start_date: '',
        appointment_time: '',
        status: ''
    });
    const [petOptions, setPetOptions] = useState([]);

    const packageOptions = [
        { value: 'Basic Grooming', label: 'Basic Grooming ($50)', price: 50 },
        { value: 'Premium Grooming', label: 'Premium Grooming ($75)', price: 75 },
        { value: 'Daycare', label: 'Daycare ($30/day)', price: 30 },
        { value: 'Boarding', label: 'Boarding ($45/night)', price: 45 }
    ];

    useEffect(() => {
        if (isEditOpen) {
            fetchPets();
            if (data) {
                const petOption = {
                    value: data.pet_id?._id,
                    label: data.pet_id?.pet_name + (data.pet_id?.client_id ? ` (${data.pet_id.client_id.first_name} ${data.pet_id.client_id.last_name})` : '')
                };
                const packageOption = packageOptions.find(pkg => pkg.value === data.package_name);

                setSelectedPet(petOption);
                setSelectedPackage(packageOption);
                setFormData({
                    pet_id: data.pet_id?._id || '',
                    package_name: data.package_name || '',
                    price: data.price || '',
                    start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : '',
                    appointment_time: data.appointment_time || '',
                    status: data.status || 'scheduled'
                });
            }
        }
    }, [isEditOpen, data]);

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
        }
    };

    const handlePetChange = (selectedOption) => {
        setSelectedPet(selectedOption);
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

        // For multi-day services, calculate total price
        if (selectedOption.value === 'Daycare' || selectedOption.value === 'Boarding') {
            const startDate = formData.start_date ? new Date(formData.start_date) : null;
            const endDate = formData.end_date ? new Date(formData.end_date) : null;

            if (startDate && endDate) {
                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                calculatedPrice = calculatedPrice * days;
            }
        }

        setSelectedPackage(selectedOption);
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

            // Recalculate price when dates change for multi-day services
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

    const handleSubmit = async (event, errors) => {
        event.preventDefault();
        if (errors && errors.length > 0) return;

        try {
            await axios.patch(`${API_URL}/appointments/${data._id}`, formData);
            onAppointmentUpdated();
            close();
        } catch (err) {
            console.error('Error updating appointment:', err);
        }
    };

    return (
        <Modal isOpen={isEditOpen} size="lg" backdrop={'static'} style={{ overflow: 'hidden' }} centered={true} keyboard={false}>
            <ModalHeader className="bg-primary text-white">
                Edit Appointment
            </ModalHeader>
            <ModalBody>
                <AvForm onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <AvGroup>
                                <Label for="pet">Pet</Label>
                                <Select
                                    id="pet"
                                    value={selectedPet}
                                    onChange={handlePetChange}
                                    options={petOptions}
                                    placeholder="Select a pet"
                                    isSearchable
                                    required
                                />
                            </AvGroup>
                        </Col>
                        <Col md={6}>
                            <AvGroup>
                                <Label for="package">Package</Label>
                                <Select
                                    id="package"
                                    value={selectedPackage}
                                    onChange={handlePackageChange}
                                    options={packageOptions}
                                    placeholder="Select a package"
                                    isSearchable
                                    required
                                />
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
                    <Row className="mt-4">
                        <Col className="text-center">
                            <Button type="submit" color="primary" className="me-2">
                                Update Appointment
                            </Button>
                            <Button color="secondary" onClick={close}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </AvForm>
            </ModalBody>
        </Modal>
    );
};

export default AppointmentEditModal; 