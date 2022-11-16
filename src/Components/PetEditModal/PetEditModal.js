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
    const [petName, setPetName] = useState("");
    // const [client_id, setClient_id] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [allergies, setAllergies] = useState("");
    const [medicalCondition, setMedicalCondition] = useState("");

    



    useEffect(() => {
       if (data){
        setPetName(data.petName)
        setAge(data.age)
        setGender(data.gender)
        setAllergies(data.allergies)
        setMedicalCondition(data.medicalCondition)
       }
    }, [data]);


    const handleSubmit = (event, errors, value) => {
        if (errors.length === 0){
            var today = new Date(), day, month;
            if (today.getDate() <= 9){
                day = "0" + today.getDate();
            } else{
                day = today.getDate();
            }
           
            if (today.getMonth() <= 9){
                month = "0" + (today.getMonth() + 1);
            } else{
                month = today.getMonth() + 1;
            }

            var date = today.getFullYear() + '-' + (month) + '-' + day;
            console.log("Current Date: ", date)
            value['joined_date'] = date;
            value['status'] = 'active';
            console.log("value: ", value);
            update(value);
        }
    }

    return (
        <div>
            <Modal isOpen={isEditOpen} size={'xl'} backdrop={'static'} style={{overflow:'hidden'}} centered={true} keyboard={false}>
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
                                    onChange={( event ) => setPetName(event.target.value)}
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
                                <AvField id="breed" name="breed" label="Breed" type="email" placeholder="Required" value={breed} onChange={( event ) => setBreed(event.target.value)} required />
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
                                    onChange={( event ) => setAge(event.target.value)}
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
                                    onChange={( event ) => setGender(event.target.value)}
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
                                    onChange={( event ) => setAllergies(event.target.value)}
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
                                    onChange={( event ) => setMedicalCondition(event.target.value)}
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
