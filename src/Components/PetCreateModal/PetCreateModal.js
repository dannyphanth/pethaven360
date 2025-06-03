import { React, useEffect, useState } from 'react'
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    // Form,
    FormGroup,
    Label,
    // Input,
    // FormText,
    Col,
    Row,
} from 'reactstrap'
import Select from 'react-select'
import axios from 'axios'
import {
    AvForm,
    AvField,
    AvGroup,
    AvInput,
    AvFeedback,
    // AvRadioGroup, 
    // AvRadio, 
    // AvCheckboxGroup, 
    // AvCheckbox
} from 'availity-reactstrap-validation'

function PetCreateModal(props) {
    const [petName, setPetName] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [allergies, setAllergies] = useState("");
    const [medicalCondition, setMedicalCondition] = useState("");

    const [client_id, setClient_id] = useState({
        value: "",
        label: "Required",

    });
    const [clientOptions, setClientOptions] = useState([{}]);


    useEffect(() => {
        if (props.isCreateOpen === true) {
            setPetName("");
            setBreed("");
            setAge("");
            setGender("");
            setAllergies("");
            setMedicalCondition("");
            setClient_id({
                value: "",
                label: "Required"
            });
            getClientsData();
        }
    }, [props.isCreateOpen]);

    const getClientsData = () => {
        axios
            .get("http://localhost:5000/clients/")
            .then((response) => {
                console.log("response: ", response.data);
                var clients_list = response.data;
                let clients = [{
                    value: "",
                    label: "Required",
                }];
                for (var i in clients_list) {
                    var clientOption = {
                        value: clients_list[i]['_id'],
                        label: clients_list[i]['first_name'] + ' ' + clients_list[i]['last_name'],
                    }
                    clients.push(clientOption);
                }
                setClientOptions(clients);
            })
            .catch(function (error) {
                console.log(error);
            });
    };



    const clear = () => {
        setPetName("");
        setBreed("");
        setAge("");
        setGender("");
        setAllergies("");
        setMedicalCondition("")

        setClient_id({
            value: "",
            label: "Required",
        });
    }

    const handleSubmit = (event, errors, value) => {
        console.log("errors: ", errors)
        if (errors.length === 0) {
            console.log("passed validation")
            var today = new Date(), day, month;
            if (today.getDate() <= 9) {
                console.log(today.getDate)
                day = "0" + today.getDate();
            } else {
                day = today.getDate();
            }

            if (today.getMonth() <= 9) {
                console.log(today.getDate)
                month = "0" + (today.getMonth() + 1);
            } else {
                month = today.getMonth() + 1;
            }

            var date = today.getFullYear() + '-' + (month) + '-' + day;
            console.log("Current Date: ", date)

            const petData = {
                client_id: client_id.value,
                pet_name: petName,
                breed: breed,
                age: age,
                gender: gender,
                allergies: allergies || '',
                medical_condition: medicalCondition || '',
                joined_date: date,
                status: 'active'
            };

            console.log("Submitting pet data:", petData);
            props.create(petData);
        }
    }

    return (
        <Modal isOpen={props.isCreateOpen} size={'xl'} backdrop={'static'} style={{ overflow: 'hidden' }} centered={true} keyboard={false}>
            <ModalHeader className='bg-primary text-white'>
                Add New Pet
            </ModalHeader>
            <ModalBody>
                <AvForm className='p-4' onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <AvGroup>
                                <Label for="client_id">
                                    Client
                                </Label>
                                <Select
                                    value={client_id}
                                    onChange={(value) => {
                                        setClient_id(value);
                                    }}
                                    name="client_id"
                                    options={clientOptions}
                                    required
                                />
                                <AvFeedback>Field is Required!</AvFeedback>
                            </AvGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <AvGroup>
                                <Label for="pet_name">
                                    Pet Name
                                </Label>
                                <AvInput
                                    id="pet_name"
                                    value={petName}
                                    onChange={(event) => setPetName(event.target.value)}
                                    name="pet_name"
                                    placeholder="Required"
                                    type="text"
                                    required
                                />
                                <AvFeedback>Field is Required!</AvFeedback>
                            </AvGroup>
                        </Col>
                        <Col>
                            <AvGroup>
                                <Label for="breed">
                                    Breed
                                </Label>
                                <AvInput
                                    id="breed"
                                    name="breed"
                                    value={breed}
                                    onChange={(event) => setBreed(event.target.value)}
                                    placeholder="Required"
                                    type="text"
                                    required
                                />
                                <AvFeedback>Field is Required!</AvFeedback>
                            </AvGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <AvGroup>
                                <Label for="age">
                                    Age
                                </Label>
                                <AvInput
                                    id="age"
                                    value={age}
                                    onChange={(event) => setAge(event.target.value)}
                                    name="age"
                                    placeholder="Required"
                                    type="text"
                                    required
                                />
                                <AvFeedback>Field is Required!</AvFeedback>
                            </AvGroup>
                        </Col>
                        <Col>
                            <AvGroup>
                                <Label for="gender">
                                    Gender
                                </Label>
                                <AvInput
                                    id="gender"
                                    value={gender}
                                    onChange={(event) => setGender(event.target.value)}
                                    name="gender"
                                    placeholder="Required"
                                    type="text"
                                    required
                                />
                                <AvFeedback>Field is Required!</AvFeedback>
                            </AvGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <AvGroup>
                                <Label for="allergies">
                                    Allergies
                                </Label>
                                <AvInput
                                    id="allergies"
                                    value={allergies}
                                    onChange={(event) => setAllergies(event.target.value)}
                                    name="allergies"
                                    placeholder="Optional"
                                    type="text"
                                />
                            </AvGroup>
                        </Col>
                        <Col>
                            <AvGroup>
                                <Label for="medical_condition">
                                    Medical Condition
                                </Label>
                                <AvInput
                                    id="medical_condition"
                                    value={medicalCondition}
                                    onChange={(event) => setMedicalCondition(event.target.value)}
                                    name="medical_condition"
                                    placeholder="Optional"
                                    type="text"
                                />
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
                            props.close()
                        }}
                        className="btn btn-warning text-white"
                    >
                        Close
                    </Button>
                    <Button onClick={() => clear()} className="btn btn-secondary text-white">Clear</Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default PetCreateModal;





