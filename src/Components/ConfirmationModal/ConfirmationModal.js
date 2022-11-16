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


function ConfirmationModal(props) {

    const [rowData, setRowData] = useState('');
    const [tableType, setTableType] = useState('');
    const [operation, setOperation] = useState('');
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        setRowData(props.data["data"]);
        setTableType(props.tableType);
        setOperation(props.action);
        if(props.action === "Deletion"){
            setActionType("delete");
        }else if(props.action === "Deactivation"){
            setActionType('deactivate');
        }else{
            setActionType('reactivate');
        }

    }, [props.isConfirmationOpen, props.action, props.tableType, props.data]);



    const submitHandler = () => {
        console.log("reacehd the submit handler for the confirmation modal");
        if(operation === "Deletion"){
            props.delete(props.data["id"]);
        }else if(props.action === "Deactivation"){
            props.deactivate(props.data["id"]);
        }else if(props.action === "Reactivation"){
            props.reactivate(props.data["id"]);
        }
    }

    return (
        <Modal isOpen={props.isConfirmationOpen} size={'md'} backdrop={'static'} style={{overflow:'hidden'}} centered={true} keyboard={false}>
            <ModalHeader className='bg-warning text-white'>
                Confirm {operation}
            </ModalHeader>
            <ModalBody>
                <Form className='p-4'>
                    <Row>
                        <Col>
                            <p className='text-center'>Are you sure you want to {actionType} {rowData} from the {tableType} list?</p>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
            <ModalFooter>
                <div className='w-100 d-flex flex-row justify-content-around'>
                    <Button onClick={() => submitHandler()} className="btn btn-warning text-white">Yes</Button>
                    <Button onClick={props.close} className="btn btn-secondary text-white">No</Button>
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default ConfirmationModal;