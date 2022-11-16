import { React, useState, useEffect , useMemo } from "react";
import { 
  PencilSquare, 
  Trash, 
  Check, 
  Plus, 
  SlashCircle  
} from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.css';
import { 
    Button,
    // Row,
    // Col,
    Card,
    CardHeader,
    CardBody,
} from 'reactstrap';
import axios from 'axios'
import Tooltip from '@material-ui/core/Tooltip';
// import { Table } from '../../Components/Table';
import { AppCreateModal } from '../../Components/AppCreateModal';
// import { ClientEditModal } from "../../Components/ClientEditModal";
import { SuccessModal } from "../../Components/SuccessModal";
import { ErrorModal } from '../../Components/ErrorModal';
import { ConfirmationModal } from '../../Components/ConfirmationModal';
import { App } from '../../Components/ReactTable';

const Appointments = props => {

        //Global Variables
        const card = { margin: '10vh 3vw' };
        const utilityHeader = { display: 'flex', justifyContent: 'space-between', margin: '0 14px' };
        // const center = { textAlign: 'center' };
        const tableType = "Clients";
    
        //useState Variables
        const [createIsOpen, setCreateIsOpen] = useState(false);
        const [editIsOpen, setEditIsOpen] = useState(false);
        const [successIsOpen, setSuccessIsOpen] = useState(false);
        const [successMessage, setSuccessMessage] = useState('');
        const [errorIsOpen, setErrorIsOpen] = useState(false);
        const [errorMessage, setErrorMessage] = useState('');
        const [tableAction, setTableAction] = useState('');
        const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);
        const [dataToDelete, setDataToDelete] = useState({});
        const [data, setData] = useState([]);
        const [rowData, setRowData] = useState({});



    const columns = useMemo(
        () => [
          {
            Header: 'Action',
            accessor: '',
            Cell: ({ row }) => {
              return (
                <div>
                    <Tooltip title="Edit Client" placement="top">
                      <Button size="sm" color="warning" className="m-2" onClick={() => editHandler(row.original)}>
                        <PencilSquare size={14} className="mb-1"/>
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete Client" placement="top">
                      <Button size="sm" color="danger" className="m-2" onClick={() => deleteHandler(row.original)}>
                        <Trash size={14} className="mb-1"/>
                      </Button>
                    </Tooltip>
                    <Tooltip title="Payment Center" placement="top">
                      <Button size="sm" color="info" className="m-2" onClick={() => paymentHandler(row.original)}>
                        <Trash size={14} className="mb-1"/>
                      </Button>
                    </Tooltip>
                   
                </div>              
              );
            }
          },  
          {
            Header: 'Pet Name',
            accessor: 'pet_id',
            // Cell: ({row}) => {
            //   return row.original;
            // }
          },
          {
            Header: 'Package Name',
            accessor: 'package_name',
          },
          {
            Header: 'Price',
            accessor: 'price', // accessor is the "key" in the data
          },
          {
            Header: 'Balance',
            accessor: 'balance',
          },
          {
            Header: 'Start Date',
            accessor: 'start_date',
            // Cell: ({ row }) => {
            //     let date_list = row.original.joined_date.split('T');
            //     return date_list[0];
            // }
          },
          {
            Header: 'End Date',
            accessor: 'end_date',
            // Cell: ({ row }) => {
            //   if (row.original.end === ""){
            //     return 'N/A';
            //   }else{
            //     return row.original.emergency_contact_name;
            //   }
            // }
          },
          {
            Header: 'Status',
            accessor: 'status',
            // Cell: ({ row }) => {
            //   if (row.original.status === true){
            //     return 'Active';
            //   }else{
            //     return 'Inactive';
            //   }
            // }
          },      
        ],
        []
    )

    //Handler Functions
    const deleteHandler = (data) => {
        console.log("delete handler clicked: ", data);
        // var dataToDelete = {
        //     "id" : data._id,
        //     "data": data.first_name + " " + data.last_name,
        // }
        // setDataToDelete(dataToDelete);
        // setTableAction("Deletion");
        // setConfirmationIsOpen(true);
    }

    const paymentHandler = (data) => {
        console.log("payment handler clicked: ", data);
        // var dataToDelete = {
        //     "id" : data._id,
        //     "data": data.first_name + " " + data.last_name,
        // }
        // setDataToDelete(dataToDelete);
        // setTableAction("Deletion");
        // setConfirmationIsOpen(true);
    }

    const editHandler = (edit_data) => {
        console.log("edit_data: ", edit_data);
        // setRowData(edit_data);
        // setEditIsOpen(true);
        console.log("edit handler clicked");
    }

    const createHandler = () => {
        setCreateIsOpen(true);
    }


    return (
        <div style={{ textAlign: 'center', backgroundColor: "white", height: '80vh'}}>
          <Card style={card} className="border-secondary">
            <CardHeader className="border-secondary bg-secondary">
              <h3 className="header-title text-center mt-3 mb-3">Client Manager</h3>
            </CardHeader>
            <CardBody>
                <span style={utilityHeader}>
                  <Tooltip title="Add New Client" placement="top">
                    <Button onClick={createHandler} className="bg-success border-success">
                      <Plus size={24}/>
                    </Button>
                  </Tooltip>
                  {/* <Tooltip title="Filter">
                      <GearFill size="32" />
                  </Tooltip> */}
                </span>
                <App
                  columns={columns}
                  data={data}
                  defaultPageSize={10}
                  maxHeight={'50vh'}
                />
            </CardBody>
          </Card>
          <AppCreateModal
            isCreateOpen={createIsOpen}
            
          />
        </div>
    );
};

export default Appointments;