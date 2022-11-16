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
    AvSelect
    // AvRadioGroup, 
    // AvRadio, 
    // AvCheckboxGroup, 
    // AvCheckbox
} from 'availity-reactstrap-validation'

// import { AvSelectField } from '@availity/reactstrap-validation-select';



function AppCreateModal(props) {
    const [pet, setPet] = useState({
        value: "",
        label: "Required",
    });
    const [package_name, setPackage] = useState({
        value: "",
        label: "Required",
    });
    const [petOptions, setPetOptions] = useState([{}]);
    const [packageOptions, setPackageOptions] = useState([{}]);

    useEffect(() => {
        console.log(props.isCreateOpen);
        if(props.isCreateOpen === true){
            setPetOptions(getPetsData());
            setPackageOptions(getPackagesData());
        }
    }, [props.isCreateOpen]);


      

    const getPackagesData = () => {
        let packages = [{
            value: "",
            label: "Required",
        }];
        axios
        .get("http://localhost:5000/values/packages")
        .then((response) => {
          console.log("response: ", response.data);
          var packages_list = response.data;
          for (var i in packages_list){
            console.log(packages_list[i]['value']);
            var packageOption = {
                value: packages_list[i]['value'],
                label: packages_list[i]['value'],              
            }
            packages.push(packageOption);
          }
          console.log(packages);
        })
        .catch(function (error) {
          console.log(error);
        });

        return packages;
    };

    const getPetsData = () => {
        let pets = [{
            value: "",
            label: "Required",
        }];
        axios
        .get("http://localhost:5000/pets/")
        .then((response) => {
            console.log("response: ", response.data);
            var pets_list = response.data;
            for (var i in pets_list){
                var petOption = {
                    value: pets_list[i]['_id'],
                    label: pets_list[i]['pet_name'],
                } 
                pets.push(petOption);
            }
            console.log(pets);
        })
        .catch(function (error) {
          console.log(error);
        });
        return pets;
    };

    const clear = () => {
        setPet({
            value: "",
            label: "Required",
        });
        setPackage({
            value: "",
            label: "Required",
        });
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
                Add New Appointment
            </ModalHeader>
            <ModalBody>
                <AvForm className='p-4' onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <AvGroup>
                                <Label for="pet">
                                Pet
                                </Label>
                                <Select
                                    value={pet}
                                    onChange={( value ) => { 
                                            setPet(value);
                                        }
                                    }
                                    name="pet"
                                    options={petOptions}
                                    required
                                />
                                <AvFeedback>Field is Required!</AvFeedback>
                            </AvGroup>
                        </Col>
                        <Col>
                            <AvGroup>
                                <Label for="package">
                                Package
                                </Label>
                                <Select
                                    value={package_name}
                                    onChange={( value ) => {
                                            setPackage(value);
                                        }
                                    }
                                    name="package"
                                    options={packageOptions}
                                    required
                                />
                                <AvFeedback>Field is Required!</AvFeedback>
                            </AvGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            
                        </Col>
                        <Col>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            
                        </Col>
                        <Col>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            
                        </Col>
                        <Col>
                            
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

export default AppCreateModal;