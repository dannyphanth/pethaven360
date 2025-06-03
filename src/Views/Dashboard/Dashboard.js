import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Alert,
    Table
} from 'reactstrap';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const Dashboard = () => {
    const [stats, setStats] = useState({
        activePets: 0,
        activeClients: 0,
        todayAppointments: 0,
        monthlyRevenue: 0,
        upcomingAppointments: 0
    });
    const [todayAppointmentsList, setTodayAppointmentsList] = useState([]);
    const [upcomingAppointmentsList, setUpcomingAppointmentsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
        fetchAppointments();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            console.log('Fetching dashboard stats...');
            const response = await axios.get(`${API_URL}/dashboard/stats`);
            console.log('Dashboard response:', response.data);
            setStats(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            console.log('Fetching appointments...');
            const response = await axios.get(`${API_URL}/appointments`);
            console.log('Raw appointments data:', response.data);
            const appointments = response.data;

            // Get today's date in user's timezone
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Filter today's appointments
            const todayAppts = appointments.filter(app => {
                const appDate = new Date(app.start_date);
                // Convert to local timezone date for comparison
                const localAppDate = new Date(appDate.getTime() - appDate.getTimezoneOffset() * 60000);
                localAppDate.setHours(0, 0, 0, 0);

                console.log('Comparing dates:', {
                    appointment: localAppDate.toISOString(),
                    today: today.toISOString(),
                    isToday: localAppDate.toDateString() === today.toDateString(),
                    status: app.status
                });

                return localAppDate.toDateString() === today.toDateString() && app.status === 'scheduled';
            });
            console.log('Today\'s appointments:', todayAppts);

            // Filter upcoming appointments (next 7 days, excluding today)
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);

            const upcomingAppts = appointments.filter(app => {
                const appDate = new Date(app.start_date);
                // Convert to local timezone date for comparison
                const localAppDate = new Date(appDate.getTime() - appDate.getTimezoneOffset() * 60000);
                localAppDate.setHours(0, 0, 0, 0);

                const isUpcoming = localAppDate > today && localAppDate <= nextWeek;
                console.log('Checking upcoming:', {
                    date: localAppDate.toISOString(),
                    isAfterToday: localAppDate > today,
                    isBeforeNextWeek: localAppDate <= nextWeek,
                    isUpcoming,
                    status: app.status
                });

                return isUpcoming && app.status === 'scheduled';
            });
            console.log('Upcoming appointments:', upcomingAppts);

            // Sort appointments by time
            const sortByTime = (a, b) => {
                const timeA = a.appointment_time || '00:00';
                const timeB = b.appointment_time || '00:00';
                return timeA.localeCompare(timeB);
            };

            setTodayAppointmentsList(todayAppts.sort(sortByTime));
            setUpcomingAppointmentsList(upcomingAppts.sort((a, b) => {
                const dateCompare = new Date(a.start_date) - new Date(b.start_date);
                return dateCompare === 0 ? sortByTime(a, b) : dateCompare;
            }));
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError(err.response?.data || err.message);
        }
    };

    const StatCard = ({ title, value, color }) => (
        <Card style={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            height: '100%'
        }}>
            <CardHeader style={{
                backgroundColor: '#2c3e50',
                color: 'white',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                border: 'none',
                padding: '15px 20px'
            }}>
                {title}
            </CardHeader>
            <CardBody style={{
                padding: '20px'
            }}>
                <h2 className="text-center" style={{
                    margin: 0,
                    color: '#2c3e50',
                    fontSize: '2rem'
                }}>{value}</h2>
            </CardBody>
        </Card>
    );

    const AppointmentTable = ({ appointments, title }) => (
        <Card style={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            height: '100%'
        }}>
            <CardHeader style={{
                backgroundColor: '#2c3e50',
                color: 'white',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                border: 'none',
                padding: '15px 20px'
            }}>
                {title}
            </CardHeader>
            <CardBody style={{ padding: '0' }}>
                {appointments.length === 0 ? (
                    <p className="text-center" style={{
                        padding: '20px',
                        color: '#95a5a6',
                        margin: 0
                    }}>No appointments scheduled</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <Table hover responsive style={{
                            margin: 0,
                            borderCollapse: 'separate',
                            borderSpacing: 0
                        }}>
                            <thead>
                                <tr style={{
                                    backgroundColor: '#f8f9fa'
                                }}>
                                    <th style={{
                                        padding: '15px 20px',
                                        color: '#2c3e50',
                                        fontWeight: '600',
                                        borderBottom: '2px solid #eee'
                                    }}>Time</th>
                                    <th style={{
                                        padding: '15px 20px',
                                        color: '#2c3e50',
                                        fontWeight: '600',
                                        borderBottom: '2px solid #eee'
                                    }}>Pet Name</th>
                                    <th style={{
                                        padding: '15px 20px',
                                        color: '#2c3e50',
                                        fontWeight: '600',
                                        borderBottom: '2px solid #eee'
                                    }}>Client Name</th>
                                    <th style={{
                                        padding: '15px 20px',
                                        color: '#2c3e50',
                                        fontWeight: '600',
                                        borderBottom: '2px solid #eee'
                                    }}>Package</th>
                                    <th style={{
                                        padding: '15px 20px',
                                        color: '#2c3e50',
                                        fontWeight: '600',
                                        borderBottom: '2px solid #eee'
                                    }}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((app, index) => (
                                    <tr key={index} style={{
                                        transition: 'background-color 0.2s ease'
                                    }}>
                                        <td style={{
                                            padding: '15px 20px',
                                            color: '#2c3e50',
                                            borderBottom: '1px solid #eee'
                                        }}>{app.appointment_time || 'N/A'}</td>
                                        <td style={{
                                            padding: '15px 20px',
                                            color: '#2c3e50',
                                            borderBottom: '1px solid #eee'
                                        }}>{app.pet_id?.pet_name || 'N/A'}</td>
                                        <td style={{
                                            padding: '15px 20px',
                                            color: '#2c3e50',
                                            borderBottom: '1px solid #eee'
                                        }}>
                                            {app.pet_id?.client_id ?
                                                `${app.pet_id.client_id.first_name} ${app.pet_id.client_id.last_name}`
                                                : 'N/A'}
                                        </td>
                                        <td style={{
                                            padding: '15px 20px',
                                            color: '#2c3e50',
                                            borderBottom: '1px solid #eee'
                                        }}>{app.package_name}</td>
                                        <td style={{
                                            padding: '15px 20px',
                                            color: '#2c3e50',
                                            borderBottom: '1px solid #eee'
                                        }}>${app.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </CardBody>
        </Card>
    );

    if (loading) {
        return (
            <div className="text-center p-5">
                <h3 style={{ color: '#2c3e50' }}>Loading dashboard...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-5">
                <Alert color="danger" style={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <h4>Error loading dashboard statistics</h4>
                    <p>{error}</p>
                    <small>Please check the browser console for more details.</small>
                </Alert>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#f5f6fa',
            minHeight: '80vh',
            padding: '30px',
            borderRadius: '12px'
        }}>
            <h2 className="mb-4" style={{ color: '#2c3e50' }}>Dashboard</h2>
            <Row>
                <Col md={4} lg={2} className="mb-4">
                    <StatCard
                        title="Active Pets"
                        value={stats.activePets}
                        color="primary"
                    />
                </Col>
                <Col md={4} lg={2} className="mb-4">
                    <StatCard
                        title="Active Clients"
                        value={stats.activeClients}
                        color="success"
                    />
                </Col>
                <Col md={4} lg={2} className="mb-4">
                    <StatCard
                        title="Today's Appointments"
                        value={stats.todayAppointments}
                        color="info"
                    />
                </Col>
                <Col md={4} lg={3} className="mb-4">
                    <StatCard
                        title="Revenue This Month"
                        value={`$${stats.monthlyRevenue.toFixed(2)}`}
                        color="warning"
                    />
                </Col>
                <Col md={4} lg={3} className="mb-4">
                    <StatCard
                        title="Upcoming Appointments"
                        value={stats.upcomingAppointments}
                        color="secondary"
                    />
                </Col>
            </Row>

            <Row>
                <Col md={6} className="mb-4">
                    <AppointmentTable
                        appointments={todayAppointmentsList}
                        title="Today's Appointments"
                    />
                </Col>
                <Col md={6} className="mb-4">
                    <AppointmentTable
                        appointments={upcomingAppointmentsList}
                        title="Upcoming Appointments (Next 7 Days)"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;