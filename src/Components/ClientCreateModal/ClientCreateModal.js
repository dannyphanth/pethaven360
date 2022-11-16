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


function ClientCreateModal(props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emergencyName, setEmergencyName] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [vetHospital, setVetHospital] = useState("");
    const [vetHospitalContact, setVetHospitalContact] = useState("");

    useEffect(() => {
        if(props.isCreateOpen === true){
            setFirstName("");
            setLastName("");
            setEmail("");
            setAddress("");
            setPhoneNumber("");
            setEmergencyName("");
            setEmergencyContact("");
            setVetHospital("");
            setVetHospitalContact("");
        }
    }, [props.isCreateOpen]);

    const clear = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setAddress("");
        setPhoneNumber("");
        setEmergencyName("");
        setEmergencyContact("");
        setVetHospital("");
        setVetHospitalContact("");
    }

    const handleSubmit = (event, errors, value) => {
        console.log("errors: ", errors)
        if (errors.length === 0){
            console.log("passed validation")
            var today = new Date(), day, month;
            if (today.getDate() <= 9){
                console.log(today.getDate)
                day = "0" + today.getDate();
            } else{
                day = today.getDate();
            }
           
            if (today.getMonth() <= 9){
                console.log(today.getDate)
                month = "0" + (today.getMonth() + 1);
            } else{
                month = today.getMonth() + 1;
            }

            var date = today.getFullYear() + '-' + (month) + '-' + day;
            console.log("Current Date: ", date)
            value['joined_date'] = date;
            value['status'] = 'active';
            console.log("value: ", value);
            props.create(value);
        }
    }


    return (
        <Modal isOpen={props.isCreateOpen} size={'xl'} backdrop={'static'} style={{overflow:'hidden'}} centered={true} keyboard={false}>
            <ModalHeader className='bg-primary text-white'>
                Add New Client
            </ModalHeader>
            <ModalBody>
                <AvForm className='p-4' onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <AvGroup>
                                <Label for="first_name">
                                First Name
                                </Label>
                                <AvInput 
                                    id="first_name"
                                    value={firstName}
                                    onChange={( event ) => setFirstName(event.target.value)}
                                    name="first_name"
                                    placeholder="Required"
                                    type="text"
                                    required
                                />
                                <AvFeedback>Field is Required!</AvFeedback>
                            </AvGroup>
                        </Col>
                        <Col>
                            <AvGroup>
                                <Label for="last_name">
                                Last Name
                                </Label>
                                <AvInput 
                                    id="last_name"
                                    value={lastName}
                                    onChange={( event ) => setLastName(event.target.value)}
                                    name="last_name"
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
                                <AvField id="email" name="email" label="Email" type="email" placeholder="Required" value={email} onChange={( event ) => setEmail(event.target.value)} required />
                                <AvFeedback>Field is Required!</AvFeedback>
                            </AvGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <AvGroup>
                                <Label for="address">
                                Address
                                </Label>
                                <AvInput 
                                    id="address"
                                    value={address}
                                    onChange={( event ) => setAddress(event.target.value)}
                                    name="address"
                                    placeholder="Required"
                                    type="text"
                                    required
                                />
                                <AvFeedback>Field is Required!</AvFeedback>
                            </AvGroup>
                        </Col>
                        <Col>
                            <AvGroup>
                                <Label for="phone_number">
                                Phone Number
                                </Label>
                                <AvInput 
                                    id="phone_number"
                                    value={phoneNumber}
                                    onChange={( event ) => setPhoneNumber(event.target.value)}
                                    name="phone_number"
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
                                <Label for="emergency_contact_name">
                                Emergency Contact Name
                                </Label>
                                <AvInput 
                                    id="emergency_contact_name"
                                    value={emergencyName}
                                    onChange={( event ) => setEmergencyName(event.target.value)}
                                    name="emergency_contact_name"
                                    placeholder="Optional"
                                    type="text"
                                />
                            </AvGroup>
                        </Col>
                        <Col>
                            <AvGroup>
                                <Label for="emergency_contact">
                                Emergency Contact Info
                                </Label>
                                <AvInput 
                                    id="emergency_contact"
                                    value={emergencyContact}
                                    onChange={( event ) => setEmergencyContact(event.target.value)}
                                    name="emergency_contact"
                                    placeholder="Optional"
                                    type="text"
                                />
                            </AvGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <AvGroup>
                                <Label for="vet_hospital">
                                Vet Hospital
                                </Label>
                                <AvInput 
                                    id="vet_hospital"
                                    value={vetHospital}
                                    onChange={( event ) => setVetHospital(event.target.value)}
                                    name="vet_hospital"
                                    placeholder="Optional"
                                    type="text"
                                />
                            </AvGroup>
                        </Col>
                        <Col>
                            <AvGroup>
                                <Label for="vet_hospital_contact">
                                Vet Hospital Contact Info
                                </Label>
                                <AvInput 
                                    id="vet_hospital_contact"
                                    value={vetHospitalContact}
                                    onChange={( event ) => setVetHospitalContact(event.target.value)}
                                    name="vet_hospital_contact"
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

export default ClientCreateModal




