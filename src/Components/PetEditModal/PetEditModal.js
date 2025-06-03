import { React, useState, useEffect } from 'react'

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




function PetEditModal({
    isEditOpen,
    data,
    close,
    update,
}) {
    const [id, setId] = useState("");
    const [petName, setPetName] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [allergies, setAllergies] = useState("");
    const [medicalCondition, setMedicalCondition] = useState("");
    const [clientId, setClientId] = useState("");





    useEffect(() => {
        if (data) {
            setId(data._id);
            setPetName(data.pet_name);
            setBreed(data.breed);
            setAge(data.age);
            setGender(data.gender);
            setAllergies(data.allergies || "");
            setMedicalCondition(data.medical_condition || "");
            setClientId(data.client_id?._id || data.client_id || "");
        }
    }, [data]);


    const handleSubmit = (event, errors, values) => {
        console.log("Form submission - errors:", errors);
        if (errors.length === 0) {
            const petData = {
                id: id,
                pet_name: petName,
                breed: breed,
                age: parseInt(age) || age,
                gender: gender,
                allergies: allergies || "",
                medical_condition: medicalCondition || "",
                ...(clientId && { client_id: clientId }),
                status: data.status || true
            };
            console.log("Submitting pet data:", petData);
            update(petData);
        }
    }

    return (
        <div>
            <Modal isOpen={isEditOpen} size={'xl'} backdrop={'static'} style={{ overflow: 'hidden' }} centered={true} keyboard={false}>
                <ModalHeader className='bg-primary text-white'>
                    Update Pet
                </ModalHeader>
                <ModalBody>
                    <AvForm className='p-4' onSubmit={handleSubmit}>
                        <Row>
                            <Col>

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
                        <Button onClick={close} className="btn btn-warning text-white">Close</Button>
                        {/* <Button onClick={clear} className="btn btn-secondary text-white">Clear</Button> */}
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default PetEditModal
