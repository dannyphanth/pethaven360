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


function ErrorModal(props) {

    const [errorMessage, setErrorMessage] = useState('');
    const [operation, setOperation] = useState('');

    useEffect(() => {
        setErrorMessage(props.message);
        setOperation(props.action);
    }, [props.isErrorOpen, props.message, props.action]);

    return (
        <Modal isOpen={props.isErrorOpen} size={'md'} backdrop={'static'} style={{overflow:'hidden'}} centered={true} keyboard={false}>
            <ModalHeader className='bg-danger text-white'>
                {operation} Error
            </ModalHeader>
            <ModalBody>
                <Form className='p-4'>
                    <Row>
                        <Col>
                            <p className='text-center'>{errorMessage}</p>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <div className='w-100 d-flex flex-row justify-content-around'>
                    <Button onClick={props.close} className="btn btn-danger text-white">Close</Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default ErrorModal;