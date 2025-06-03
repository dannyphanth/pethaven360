import { React, useState, useEffect, useMemo, forwardRef } from "react";
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
import AppointmentCreateModal from '../../Components/AppointmentCreateModal/AppointmentCreateModal';
import AppointmentEditModal from '../../Components/AppointmentEditModal/AppointmentEditModal';
import { SuccessModal } from "../../Components/SuccessModal";
import { ErrorModal } from '../../Components/ErrorModal';
import { ConfirmationModal } from '../../Components/ConfirmationModal';
import { App } from '../../Components/ReactTable';

const API_URL = 'http://localhost:5000';

// Create a forwarded ref button component
const TooltipButton = forwardRef((props, ref) => (
  <Button ref={ref} {...props}>
    {props.children}
  </Button>
));

const Appointments = () => {

  //Global Variables
  const card = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '10vh 3vw',
    border: 'none'
  };
  const utilityHeader = { display: 'flex', justifyContent: 'space-between', margin: '0 14px' }; // const center = { textAlign: 'center' };
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
  const [loading, setLoading] = useState(true);

  const columns = useMemo(
    () => [
      {
        Header: 'Action',
        accessor: 'actions',
        Cell: ({ row }) => {
          return (
            <div>
              <Tooltip title="Edit Appointment" placement="top">
                <TooltipButton size="sm" color="warning" className="m-2" onClick={() => editHandler(row.original)}>
                  <PencilSquare size={14} className="mb-1" />
                </TooltipButton>
              </Tooltip>
              <Tooltip title="Delete Appointment" placement="top">
                <TooltipButton size="sm" color="danger" className="m-2" onClick={() => deleteHandler(row.original)}>
                  <Trash size={14} className="mb-1" />
                </TooltipButton>
              </Tooltip>
            </div>
          );
        }
      },
      {
        Header: 'Pet Name',
        accessor: 'pet_id.pet_name',
        Cell: ({ row }) => {
          const pet = row.original?.pet_id;
          return pet?.pet_name || 'N/A';
        }
      },
      {
        Header: 'Client Name',
        accessor: 'pet_id.client_id',
        Cell: ({ row }) => {
          const client = row.original?.pet_id?.client_id;
          return client ? `${client.first_name} ${client.last_name}` : 'N/A';
        }
      },
      {
        Header: 'Package Name',
        accessor: 'package_name',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ value }) => value ? `$${parseFloat(value).toFixed(2)}` : 'N/A'
      },
      {
        Header: 'Date',
        accessor: 'start_date',
        Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A'
      },
      {
        Header: 'Time',
        accessor: 'appointment_time',
        Cell: ({ value }) => value || 'N/A'
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A'
      },
    ],
    []
  )

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/appointments`);
      console.log('Fetched appointments:', response.data);
      setData(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setErrorMessage('Failed to load appointments');
      setErrorIsOpen(true);
      setData([]);
      setLoading(false);
    }
  };

  //Handler Functions
  const deleteHandler = (data) => {
    if (!data || !data._id) {
      console.error('Invalid data for deletion:', data);
      setErrorMessage('Cannot delete this appointment');
      setErrorIsOpen(true);
      return;
    }

    setDataToDelete({
      id: data._id,
      data: `${data.pet_id?.pet_name || 'Unknown Pet'}'s appointment`
    });
    setTableAction("Deletion");
    setConfirmationIsOpen(true);
  }

  const editHandler = (edit_data) => {
    if (!edit_data) {
      console.error('Invalid data for editing:', edit_data);
      setErrorMessage('Cannot edit this appointment');
      setErrorIsOpen(true);
      return;
    }

    console.log("edit_data: ", edit_data);
    setRowData(edit_data);
    setEditIsOpen(true);
  }

  const createHandler = () => {
    setCreateIsOpen(true);
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <h3>Loading appointments...</h3>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', backgroundColor: "white", height: '100%', padding: '20px' }}>
      <Card style={card} className="border-0">
        <CardHeader style={{
          backgroundColor: '#2c3e50',
          borderBottom: 'none',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}>
          <h3 className="header-title text-center mt-3 mb-3 text-white">Appointment Manager</h3>
        </CardHeader>
        <CardBody>
          <span style={utilityHeader}>
            <Tooltip title="Add New Appointment" placement="top">
              <TooltipButton onClick={createHandler} className="bg-success border-success">
                <Plus size={24} />
              </TooltipButton>
            </Tooltip>
            {/* <Tooltip title="Filter">
                      <GearFill size="32" />
                  </Tooltip> */}
          </span>
          {data.length === 0 ? (
            <div className="text-center p-4">
              <h4>No appointments found</h4>
            </div>
          ) : (
            <App
              columns={columns}
              data={data}
              defaultPageSize={10}
              maxHeight={'50vh'}
            />
          )}
        </CardBody>
      </Card>
      <AppointmentCreateModal
        isCreateOpen={createIsOpen}
        close={() => setCreateIsOpen(false)}
        onAppointmentCreated={() => {
          setSuccessMessage('Appointment created successfully');
          setSuccessIsOpen(true);
          fetchAppointments();
        }}
      />
      <AppointmentEditModal
        isEditOpen={editIsOpen}
        close={() => setEditIsOpen(false)}
        data={rowData}
        onAppointmentUpdated={() => {
          setSuccessMessage('Appointment updated successfully');
          setSuccessIsOpen(true);
          fetchAppointments();
        }}
      />
      <SuccessModal
        message={successMessage}
        isSuccessOpen={successIsOpen}
        action={tableAction}
        close={() => setSuccessIsOpen(false)}
      />
      <ErrorModal
        message={errorMessage}
        isErrorOpen={errorIsOpen}
        action={tableAction}
        close={() => setErrorIsOpen(false)}
      />
      <ConfirmationModal
        isConfirmationOpen={confirmationIsOpen}
        close={() => setConfirmationIsOpen(false)}
        onConfirm={async () => {
          try {
            await axios.delete(`${API_URL}/appointments/${dataToDelete.id}`);
            setSuccessMessage('Appointment deleted successfully');
            setSuccessIsOpen(true);
            fetchAppointments();
          } catch (err) {
            console.error('Error deleting appointment:', err);
            setErrorMessage('Failed to delete appointment');
            setErrorIsOpen(true);
          }
          setConfirmationIsOpen(false);
        }}
        data={dataToDelete}
        action={tableAction}
        tableType="Appointments"
      />
    </div>
  );
};

export default Appointments;