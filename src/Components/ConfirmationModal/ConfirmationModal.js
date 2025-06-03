import { React } from 'react'
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

function ConfirmationModal({
    isConfirmationOpen,
    close,
    onConfirm,
    data,
    action = 'Deletion',
    tableType = 'Appointments'
}) {
    console.log("ConfirmationModal props:", { isConfirmationOpen, action, tableType, data });

    const handleConfirm = async () => {
        console.log("Handling confirmation with data:", data);
        if (data && data.id) {
            await onConfirm(data.id);
            close();
        }
    };

    return (
        <Modal isOpen={isConfirmationOpen} size={'md'} backdrop={'static'} style={{ overflow: 'hidden' }} centered={true} keyboard={false}>
            <ModalHeader className='text-white' style={{ backgroundColor: '#e74c3c', borderBottom: 'none' }}>
                Confirm {action}
            </ModalHeader>
            <ModalBody style={{ padding: '24px' }}>
                <Form>
                    <Row>
                        <Col>
                            <h5 style={{ color: '#2c3e50', marginBottom: '16px' }}>
                                Are you sure you want to proceed with the {action} of {data.data}?
                            </h5>
                            {data.message && (
                                <div className="alert alert-warning" style={{
                                    backgroundColor: '#fff3cd',
                                    color: '#856404',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '16px'
                                }}>
                                    {data.message}
                                </div>
                            )}
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter style={{
                borderTop: '1px solid #eee',
                padding: '16px 24px'
            }}>
                <div className='w-100 d-flex justify-content-end gap-2'>
                    <Button
                        onClick={handleConfirm}
                        style={{
                            backgroundColor: '#e74c3c',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 24px'
                        }}
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={close}
                        style={{
                            backgroundColor: '#95a5a6',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 24px'
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default ConfirmationModal;