import { 
    React, 
    // useState, 
    useEffect 
} from "react";
import { Nav } from 'react-bootstrap';
import logo from '../../Assets/pethaven360_logo.jpeg';
// import { Link } from "react-router-dom";

// import './SideBar.css';

const SideBar = (props) => {

    // const [activeTab, setActiveTab] = useState('');

    const activateState = (eventKey, e) => {
        // console.log("hit the activate State");
        // console.log("Event Key: ", eventKey);
        document.getElementById(eventKey).style.backgroundColor = 'lightblue';
        // e.preventDefault();
    }

    
    useEffect(() => {
        // console.log(window.location.href);
        var pageID = window.location.href.split('/')[3];
        // console.log(pageID);
        if(pageID === '' || pageID === 'Dashboard'){
            document.getElementById('dashboard').style.backgroundColor = 'white';
            document.getElementById('dashboard').style.fontWeight = 'bold';
            document.getElementById('dashboard').style.color = 'black';

            // setActiveTab('dashboard');
        }
        else if(pageID === 'DailyManager'){
            document.getElementById('daily_manager').style.backgroundColor = 'white';
            document.getElementById('daily_manager').style.fontWeight = 'bold';
            document.getElementById('daily_manager').style.color = 'black'

            // setActiveTab('daily_manager');
        }else if(pageID === 'Clients'){
            document.getElementById('clients').style.backgroundColor = 'white';
            document.getElementById('clients').style.fontWeight = 'bold';
            document.getElementById('clients').style.color = 'black'

            // setActiveTab('clients');
        }
        else if(pageID === 'Pets'){
            document.getElementById('pets').style.backgroundColor = 'white';
            document.getElementById('pets').style.fontWeight = 'bold';
            document.getElementById('pets').style.color = 'black'

            // setActiveTab('pets');
        }
        else if(pageID === 'Appointments'){
            document.getElementById('appointments').style.backgroundColor = 'white';
            document.getElementById('appointments').style.fontWeight = 'bold';
            document.getElementById('appointments').style.color = 'black'

            // setActiveTab('appointments');
        }
    },[]);


    return (
        <div>
            <div style={{ backgroundColor: "lightblue", height: '100vh', textDecoration: 'None'}}>
                <div style={{display:'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img src={logo} alt="Logo" style={{ width: '10rem', height: '10rem', marginTop: '25px'}} />
                </div>
                <Nav className="flex-column text-center" style={{marginTop: '25px'}} onSelect={activateState}>
                    <Nav.Item id="dashboard" className="p-3" style={{color: "black"}}>
                        <Nav.Link href="/Dashboard" eventKey={'dashboard'}>Dashboard</Nav.Link>
                    </Nav.Item>
                    <Nav.Item id="daily_manager" className="p-3">
                        <Nav.Link href="/DailyManager" eventKey={'daily_manager'}>Daily Manager</Nav.Link>
                    </Nav.Item>
                    <Nav.Item id="clients" className="p-3">
                        <Nav.Link href="/Clients" eventKey={'clients'}>Clients</Nav.Link>
                    </Nav.Item>
                    <Nav.Item id="pets" className="p-3">
                        <Nav.Link href="/Pets" eventKey={'pets'}>Pets</Nav.Link>
                    </Nav.Item>
                    <Nav.Item id="appointments" className="p-3">
                        <Nav.Link href="/Appointments" eventKey={'appointments'}>Appointments</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        </div>
    )
};

export default SideBar;