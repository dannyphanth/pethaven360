import { React, useState, useEffect, useMemo } from "react";
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
import { ClientCreateModal } from '../../Components/ClientCreateModal';
import { ClientEditModal } from "../../Components/ClientEditModal";
import { SuccessModal } from "../../Components/SuccessModal";
import { ErrorModal } from '../../Components/ErrorModal';
import { ConfirmationModal } from '../../Components/ConfirmationModal';
import { App } from '../../Components/ReactTable';
// import styled from 'styled-components'
// import { ownerDocument } from "@material-ui/core";

// const Styles = styled.div`
//   padding: 0rem;
//   margin-left: 1rem;

//   table {
//     border-spacing: 0;
//     border: 2px solid black;

//     tr {
//       :last-child {
//         td {
//           border-bottom: 0;
//         }
//       }
//     }


//     th,
//     td {
//       margin: 0rem;
//       padding: 1rem;
//       border-top: 1px solid black;
//       border-bottom: 1px solid black;
//       border-right: 1px solid black;

//       :last-child {
//         border-left: 0;
//       }
//     }
//   }

//   .pagination {
//     padding-top: 0.5rem;
//   }
// `
const Clients = props => {

  //Global Variables
  const card = {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '10vh 3vw',
    border: 'none'
  };

  const cardHeader = {
    backgroundColor: '#2c3e50',
    color: 'white',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    border: 'none'
  };

  const utilityHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    borderBottom: '1px solid #eee'
  };

  const addButton = {
    backgroundColor: '#27ae60',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };
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
  const [dataToDelete, setDataToDelete] = useState({ id: '', data: '' });
  const [data, setData] = useState([]);
  const [rowData, setRowData] = useState({});

  //useEffect
  useEffect(() => {
    getClientData();
  }, []);

  //Table Columns
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
                  <PencilSquare size={14} className="mb-1" />
                </Button>
              </Tooltip>
              <Tooltip title="Delete Client" placement="top">
                <Button size="sm" color="danger" className="m-2" onClick={() => deleteHandler(row.original)}>
                  <Trash size={14} className="mb-1" />
                </Button>
              </Tooltip>
              {row.values.status === true ?
                (
                  <Tooltip title="Deactivate Client" placement="top">
                    <Button size="sm" color="secondary" className="m-2" onClick={() => deactivateHandler(row.original)}>
                      <SlashCircle size={14} className="mb-1" />
                    </Button>
                  </Tooltip>
                ) :
                (
                  <Tooltip title="Reactivate Client" placement="top">
                    <Button size="sm" color="secondary" className="m-2" onClick={() => reactivateHandler(row.original)}>
                      <Check size={14} className="mb-1" />
                    </Button>
                  </Tooltip>
                )
              }

            </div>
          );
        }
      },
      {
        Header: 'Full Name',
        accessor: '',
        Cell: ({ row }) => {
          return row.original.first_name + " " + row.original.last_name;
        }
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Phone Number',
        accessor: 'phone_number', // accessor is the "key" in the data
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Joined Date',
        accessor: 'joined_date',
        Cell: ({ row }) => {
          let date_list = row.original.joined_date.split('T');
          return date_list[0];
        }
      },
      {
        Header: 'Emergency Contact Name',
        accessor: 'emergency_contact_name',
        Cell: ({ row }) => {
          if (row.original.emergency_contact_name === "") {
            return 'N/A';
          } else {
            return row.original.emergency_contact_name;
          }
        }
      },
      {
        Header: 'Emergency Contact',
        accessor: 'emergency_contact',
        Cell: ({ row }) => {
          if (row.original.emergency_contact === "") {
            return 'N/A';
          } else {
            return row.original.emergency_contact;
          }
        }
      },
      {
        Header: 'Vetinary Hospital',
        accessor: 'vet_hospital',
        Cell: ({ row }) => {
          if (row.original.vet_hospital === "") {
            return 'N/A';
          } else {
            return row.original.vet_hospital;
          }
        }
      },
      {
        Header: 'Vetinary Hospital Contact',
        accessor: 'vet_hospital_contact',
        Cell: ({ row }) => {
          if (row.original.vet_hospital_contact === "") {
            return 'N/A';
          } else {
            return row.original.vet_hospital_contact;
          }
        }
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }) => {
          if (row.original.status === true) {
            return 'Active';
          } else {
            return 'Inactive';
          }
        }
      },
    ],
    []
  )

  //Handler Functions
  const deleteHandler = (data) => {
    console.log("Delete handler clicked:", data);
    const dataToDelete = {
      id: data._id,
      data: `${data.first_name} ${data.last_name}`,
      message: `This will also delete all pets and appointments associated with ${data.first_name} ${data.last_name}.`
    };
    setDataToDelete(dataToDelete);
    setTableAction("Deletion");
    setConfirmationIsOpen(true);
    console.log("Set confirmation open to true");
  }

  const deactivateHandler = (data) => {
    // console.log("deactivate handler clicked: ", data);
    var dataToDelete = {
      "id": data._id,
      "data": data.first_name + " " + data.last_name,
    }
    setDataToDelete(dataToDelete);
    setTableAction("Deactivation");
    setConfirmationIsOpen(true);

  }

  const reactivateHandler = (data) => {
    // console.log("reactivate handler clicked: ", data);
    var dataToDelete = {
      "id": data._id,
      "data": data.first_name + " " + data.last_name,
    }
    setDataToDelete(dataToDelete);
    setTableAction("Reactivation");
    setConfirmationIsOpen(true);
  }

  const editHandler = (edit_data) => {
    // console.log("edit_data: ", edit_data);
    setRowData(edit_data);
    setEditIsOpen(true);
    // console.log("edit handler clicked");
  }

  const createHandler = () => {
    setCreateIsOpen(true);
  }

  //Close Functions
  const closeCreate = () => {
    setCreateIsOpen(false);
  }

  const closeUpdate = () => {
    setEditIsOpen(false);
  }

  const closeSuccess = () => {
    setSuccessIsOpen(false);
  }

  const closeError = () => {
    setErrorIsOpen(false);
  }

  const closeConfirmation = () => {
    console.log("Closing confirmation modal");
    setConfirmationIsOpen(false);
    setDataToDelete({ id: '', data: '' });
    setTableAction('');
  }

  //API Calls
  const submitCreate = (data) => {
    axios.post("http://localhost:5000/clients/", data)
      .then((res) => {
        setTableAction('Create');
        if (res.status === 201) {
          getClientData();
          closeCreate();
          setSuccessMessage(res.data);
          setSuccessIsOpen(true);
        } else {
          closeCreate();
          setErrorMessage(res.data);
          setErrorIsOpen(true);
        }
      });
  }

  const submitUpdate = (data) => {
    axios.patch("http://localhost:5000/clients/" + data.id, data)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          getClientData();
          closeUpdate();
          setTableAction('Update');
          setSuccessMessage(res.data);
          setSuccessIsOpen(true);
        } else {
          closeUpdate();
          setErrorMessage(res.data);
          setErrorIsOpen(true);
        }
      });
  }

  const submitDelete = async (data_id) => {
    try {
      const res = await axios.delete("http://localhost:5000/clients/" + data_id);

      if (res.status === 200) {
        await getClientData();  // Wait for the data to be refreshed
        closeConfirmation();
        setTableAction('Delete');
        setSuccessMessage(res.data);  // The server sends the message directly
        setSuccessIsOpen(true);
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      closeConfirmation();
      setErrorMessage(error.response?.data || 'Error deleting client. Please try again.');
      setErrorIsOpen(true);
    }
  };

  const submitDeactivate = (data_id) => {
    axios.patch("http://localhost:5000/clients/deactivate/" + data_id)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          getClientData();
          closeConfirmation();
          setTableAction('Deactivate');
          setSuccessMessage(res.data);
          setSuccessIsOpen(true);
        } else {
          closeConfirmation();
          setErrorMessage(res.data);
          setErrorIsOpen(true);
        }
      });
  }

  const submitReactivate = (data_id) => {
    // console.log(data_id);
    axios.patch("http://localhost:5000/clients/reactivate/" + data_id)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          getClientData();
          closeConfirmation();
          setTableAction('Reactivate');
          setSuccessMessage(res.data);
          setSuccessIsOpen(true);
        } else {
          closeConfirmation();
          setErrorMessage(res.data);
          setErrorIsOpen(true);
        }
      });
  }

  const getClientData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/clients/");
      setData(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setErrorMessage('Error loading clients. Please refresh the page.');
      setErrorIsOpen(true);
    }
  };

  // Return Function
  return (
    <div style={{ textAlign: 'center', backgroundColor: "white", height: '100%', padding: '20px' }}>
      <Card style={card} className="border-0">
        <CardHeader style={cardHeader}>
          <h3 className="header-title text-center mt-3 mb-3">Client Manager</h3>
        </CardHeader>
        <CardBody style={{ padding: '0' }}>
          <span style={utilityHeader}>
            <Tooltip title="Add New Client" placement="top">
              <Button style={addButton} onClick={createHandler}>
                <Plus size={24} />
              </Button>
            </Tooltip>
          </span>
          <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
            <App
              columns={columns}
              data={data}
              defaultPageSize={15}
              maxHeight={'none'}
            />
          </div>
        </CardBody>
      </Card>

      {/* Modals */}
      <ClientCreateModal
        isCreateOpen={createIsOpen}
        close={closeCreate}
        create={submitCreate}
      />
      <ClientEditModal
        data={rowData}
        isEditOpen={editIsOpen}
        close={closeUpdate}
        update={submitUpdate}
      />
      <SuccessModal
        message={successMessage}
        isSuccessOpen={successIsOpen}
        action={tableAction}
        close={closeSuccess}
      />
      <ErrorModal
        message={errorMessage}
        isErrorOpen={errorIsOpen}
        action={tableAction}
        close={closeError}
      />
      <ConfirmationModal
        isConfirmationOpen={confirmationIsOpen}
        close={closeConfirmation}
        data={dataToDelete}
        action={tableAction}
        tableType={tableType}
        onConfirm={
          tableAction === "Deletion" ? submitDelete :
            tableAction === "Deactivation" ? submitDeactivate :
              submitReactivate
        }
      />
    </div>
  );
};

export default Clients;