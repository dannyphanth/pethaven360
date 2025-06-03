import React, { useEffect } from "react";
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";
import logo from '../../Assets/pethaven360_logo.jpeg';

const SideBar = () => {
    const location = useLocation();

    useEffect(() => {
        const navItems = ['dashboard', 'clients', 'pets', 'appointments'];
        navItems.forEach(item => {
            const element = document.getElementById(item);
            if (element) {
                if ((location.pathname === '/' && item === 'dashboard') ||
                    location.pathname === `/${item.charAt(0).toUpperCase() + item.slice(1)}`) {
                    element.style.backgroundColor = '#ffffff';
                    element.style.borderRadius = '8px';
                    element.style.margin = '0 20px';
                    element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    const link = element.querySelector('a');
                    if (link) {
                        link.style.color = '#2c3e50';
                    }
                } else {
                    element.style.backgroundColor = 'transparent';
                    const link = element.querySelector('a');
                    if (link) {
                        link.style.color = '#ffffff';
                    }
                }
            }
        });
    }, [location]);

    return (
        <div style={{
            backgroundColor: "#2c3e50",
            minHeight: '100vh',
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1000
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
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                    >
                        <Link
                            to={`/${item.label}`}
                            style={{
                                color: "#ffffff",
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'color 0.3s ease',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                cursor: 'pointer'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/${item.label}`;
                            }}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    </Nav.Item>
                ))}
            </Nav>
        </div>
    );
};

export default SideBar;