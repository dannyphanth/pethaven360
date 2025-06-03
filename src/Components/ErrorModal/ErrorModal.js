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
        <Modal isOpen={props.isErrorOpen} size={'md'} backdrop={'static'} style={{ overflow: 'hidden' }} centered={true} keyboard={false}>
            <ModalHeader className='text-white' style={{ backgroundColor: '#e74c3c', borderBottom: 'none' }}>
                {operation} Error
            </ModalHeader>
            <ModalBody style={{ padding: '24px' }}>
                <Form>
                    <Row>
                        <Col>
                            <p style={{
                                color: '#2c3e50',
                                fontSize: '1.1rem',
                                margin: 0,
                                textAlign: 'center'
                            }}>
                                {errorMessage}
                            </p>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter style={{
                borderTop: '1px solid #eee',
                padding: '16px 24px'
            }}>
                <div className='w-100 d-flex justify-content-center'>
                    <Button
                        onClick={props.close}
                        style={{
                            backgroundColor: '#e74c3c',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 32px'
                        }}
                    >
                        Close
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default ErrorModal;