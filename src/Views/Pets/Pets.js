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
import { PetCreateModal } from '../../Components/PetCreateModal';
import { PetEditModal } from "../../Components/PetEditModal";
import { SuccessModal } from "../../Components/SuccessModal";
import { ErrorModal } from '../../Components/ErrorModal';
import { ConfirmationModal } from '../../Components/ConfirmationModal';
import { App } from '../../Components/ReactTable';


const Pets = props => {

  //Global Variables
  const card = { margin: '10vh 3vw' };
  const utilityHeader = { display: 'flex', justifyContent: 'space-between', margin: '0 14px' };
  // const center = { textAlign: 'center' };
  const tableType = "Pets";

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

  //useEffect
  useEffect(() => {
    getPetData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Action',
        accessor: '',
        Cell: ({ row }) => {
          return (
            <div>
              <Tooltip title="Edit Pet" placement="top">
                <Button size="sm" color="warning" className="m-2" onClick={() => editHandler(row.original)}>
                  <PencilSquare size={14} className="mb-1" />
                </Button>
              </Tooltip>
              <Tooltip title="Delete Pet" placement="top">
                <Button size="sm" color="danger" className="m-2" onClick={() => deleteHandler(row.original)}>
                  <Trash size={14} className="mb-1" />
                </Button>
              </Tooltip>
              {row.values.status === true ?
                (
                  <Tooltip title="Deactivate Pet" placement="top">
                    <Button size="sm" color="secondary" className="m-2" onClick={() => deactivateHandler(row.original)}>
                      <SlashCircle size={14} className="mb-1" />
                    </Button>
                  </Tooltip>
                ) :
                (
                  <Tooltip title="Reactivate Pet" placement="top">
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
        Header: 'Pet Name',
        accessor: 'pet_name',
      },
      {
        Header: 'Client',
        accessor: 'client_id',
        Cell: ({ row }) => {
          if (row.original.client_id) {
            return row.original.client_id.first_name + " " + row.original.client_id.last_name;
          }
          return 'N/A';
        }
      },
      {
        Header: 'Breed',
        accessor: 'breed',
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
        Header: 'Age',
        accessor: 'age',
      },
      {
        Header: 'Gender',
        accessor: 'gender',
      },
      {
        Header: 'Allergies',
        accessor: 'allergies',
        Cell: ({ row }) => {
          const allergies = row.original.allergies;
          if (!allergies || allergies.length === 0) {
            return 'N/A';
          }
          return allergies;
        }
      },
      {
        Header: 'Medical Condition',
        accessor: 'medical_condition',
        Cell: ({ row }) => {
          if (row.original.medical_condition === "") {
            return "N/A";
          }
          else {
            return row.original.medical_condition;
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

  const deleteHandler = (data) => {
    // console.log("delete handler clicked: ", data);
    var dataToDelete = {
      "id": data._id,
      "data": data.pet_name
    }
    setDataToDelete(dataToDelete);
    setTableAction("Deletion");
    setConfirmationIsOpen(true);
  }

  const deactivateHandler = (data) => {
    // console.log("deactivate handler clicked: ", data);
    var dataToDelete = {
      "id": data._id,
      "data": data.pet_name
    }
    setDataToDelete(dataToDelete);
    setTableAction("Deactivation");
    setConfirmationIsOpen(true);
  }

  const reactivateHandler = (data) => {
    // console.log("reactivate handler clicked: ", data);
    var dataToDelete = {
      "id": data._id,
      "data": data.pet_name
    }
    setDataToDelete(dataToDelete);
    setTableAction("Reactivation");
    setConfirmationIsOpen(true);
  }

  const editHandler = (edit_data) => {
    console.log("Editing pet:", edit_data);
    setRowData(edit_data);
    setEditIsOpen(true);
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
    setConfirmationIsOpen(false);
  }

  //API Calls
  const submitCreate = (data) => {
    axios.post("http://localhost:5000/pets/", data)
      .then((res) => {
        setTableAction('Create');
        if (res.status === 201) {
          getPetData();
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
    console.log("Updating pet with data:", data);
    const updateData = {
      pet_name: data.pet_name,
      breed: data.breed,
      age: data.age,
      gender: data.gender,
      allergies: data.allergies || '',
      medical_condition: data.medical_condition || '',
      client_id: data.client_id,
      status: data.status || true
    };

    axios.patch("http://localhost:5000/pets/" + data.id, updateData)
      .then((res) => {
        if (res.status === 200) {
          getPetData();
          closeUpdate();
          setTableAction('Update');
          setSuccessMessage(res.data);
          setSuccessIsOpen(true);
        }
      })
      .catch((err) => {
        console.error("Error updating pet:", err.response?.data || err.message);
        closeUpdate();
        setErrorMessage(err.response?.data || err.message);
        setErrorIsOpen(true);
      });
  }

  const submitDelete = async (data_id) => {
    try {
      const res = await axios.delete("http://localhost:5000/pets/" + data_id);

      if (res.status === 200) {
        await getPetData();  // Wait for the data to be refreshed
        closeConfirmation();
        setTableAction('Delete');
        setSuccessMessage(res.data);
        setSuccessIsOpen(true);
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      closeConfirmation();
      setErrorMessage(error.response?.data || 'Error deleting pet. Please try again.');
      setErrorIsOpen(true);
    }
  };

  const submitDeactivate = (data_id) => {
    axios.patch("http://localhost:5000/pets/deactivate/" + data_id)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          getPetData();
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
    axios.patch("http://localhost:5000/pets/reactivate/" + data_id)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          getPetData();
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

  const getPetData = () => {
    axios
      .get("http://localhost:5000/pets/")
      .then((response) => {
        console.log("response: ", response.data);
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getClientData = () => {
    axios
      .get("http://localhost:5000/clients/")
      .then((response) => {
        // console.log("response: ", response.data);
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  return (

    <div style={{ textAlign: 'center', backgroundColor: "white", height: '80vh', padding: '20px' }}>
      <Card style={card} className="border-0">
        <CardHeader style={{
          backgroundColor: '#2c3e50',
          borderBottom: 'none',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}>
          <h3 className="header-title text-center mt-3 mb-3 text-white">Pet Manager</h3>
        </CardHeader>
        <CardBody>
          <span style={utilityHeader}>
            <Tooltip title="Add New Pet" placement="top">
              <Button onClick={createHandler} className="bg-success border-success">
                <Plus size={24} />
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


      <PetCreateModal
        isCreateOpen={createIsOpen}
        close={closeCreate}
        create={submitCreate}
      />

      <PetEditModal
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
        data={dataToDelete}
        action={tableAction}
        tableType={tableType}
        isConfirmationOpen={confirmationIsOpen}
        close={closeConfirmation}
        onConfirm={
          tableAction === "Deletion" ? submitDelete :
            tableAction === "Deactivation" ? submitDeactivate :
              submitReactivate
        }
      />
    </div>
  );
};

export default Pets;