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
        const navItems = ['dashboard', 'clients', 'pets', 'appointments'];
        navItems.forEach(item => {
            const element = document.getElementById(item);
            if (element) {
                if ((pageID === '' && item === 'dashboard') || pageID === item.charAt(0).toUpperCase() + item.slice(1)) {
                    element.style.backgroundColor = '#ffffff';
                    element.style.borderRadius = '8px';
                    element.style.margin = '0 20px';
                    element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    // Update the link color when active
                    const link = element.querySelector('a');
                    if (link) {
                        link.style.color = '#2c3e50';
                    }
                } else {
                    element.style.backgroundColor = 'transparent';
                    // Reset the link color when not active
                    const link = element.querySelector('a');
                    if (link) {
                        link.style.color = '#ffffff';
                    }
                }
            }
        });
    }, []);


    return (
        <div>
            <div style={{
                backgroundColor: "#2c3e50",
                minHeight: '100vh',
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px 0'
                }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: '8rem',
                            height: '8rem',
                            borderRadius: '50%',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    />
                </div>
                <Nav className="flex-column" style={{ marginTop: '30px' }}>
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                        { id: 'clients', label: 'Clients', icon: '👥' },
                        { id: 'pets', label: 'Pets', icon: '🐾' },
                        { id: 'appointments', label: 'Appointments', icon: '📅' }
                    ].map(item => (
                        <Nav.Item
                            key={item.id}
                            id={item.id}
                            className="p-3"
                            style={{
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Nav.Link
                                href={`/${item.label}`}
                                style={{
                                    color: "#ffffff",
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </div>
        </div>
    )
};

export default SideBar;