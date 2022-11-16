import { React, useEffect, useState } from 'react'
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    // FormGroup,
    // Label,
    // Input,
    // FormText,
    Col,
    Row,
} from 'reactstrap'


function SuccessModal(props) {

    const [successMessage, setSuccessMessage] = useState('');
    const [operation, setOperation] = useState('');

    useEffect(() => {
        setSuccessMessage(props.message);
        setOperation(props.action);
    }, [props.isSuccessOpen, props.message, props.action]);

    return (
        <Modal isOpen={props.isSuccessOpen} size={'md'} backdrop={'static'} style={{overflow:'hidden'}} centered={true} keyboard={false}>
            <ModalHeader className='bg-success text-white'>
                {operation} Successful
            </ModalHeader>
            <ModalBody>
                <Form className='p-4'>
                    <Row>
                        <Col>
                            <p className='text-center'>{successMessage}</p>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <div className='w-100 d-flex flex-row justify-content-around'>
                    <Button onClick={props.close} className="btn btn-success text-white">Close</Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default SuccessModal;




