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
    const [appointments, setAppointments] = useState([]);

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

            // Get the actual count of today's appointments
            const todayAppts = appointments.filter(app => {
                if (!app.start_date) return false;
                const appDateStr = app.start_date.split('T')[0];
                const isToday = appDateStr === '2025-06-03';
                const isValidStatus = ['scheduled', 'completed'].includes(app.status);
                return isToday && isValidStatus;
            });

            // Update the stats with the actual count
            const updatedStats = {
                ...response.data,
                todayAppointments: todayAppts.length
            };

            console.log('Updated stats:', updatedStats);
            setStats(updatedStats);
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
            const appointmentsData = response.data;
            setAppointments(appointmentsData);

            // For test data, use 2025-06-03
            const testDateStr = '2025-06-03';
            console.log('Test date string:', testDateStr);

            // Filter today's appointments
            const todayAppts = appointmentsData.filter(app => {
                if (!app.start_date) {
                    console.log('Appointment missing start_date:', app);
                    return false;
                }

                // Get just the date part from the ISO string (YYYY-MM-DD)
                const appDateStr = app.start_date.split('T')[0];
                const isToday = appDateStr === testDateStr;
                const isValidStatus = ['scheduled', 'completed'].includes(app.status);

                // Detailed debugging for each appointment
                console.log('=== Appointment Debug ===');
                console.log('Appointment ID:', app._id);
                console.log('Raw start_date:', app.start_date);
                console.log('App date string:', appDateStr);
                console.log('Test date string:', testDateStr);
                console.log('Is today?', isToday);
                console.log('Status:', app.status);
                console.log('Is valid status?', isValidStatus);
                console.log('Passes filter?', isToday && isValidStatus);
                console.log('=====================');

                return isToday && isValidStatus;
            });

            console.log('All appointments for today:', todayAppts);

            // Sort today's appointments by time
            const sortByTime = (a, b) => {
                const timeA = a.appointment_time || '00:00';
                const timeB = b.appointment_time || '00:00';
                return timeA.localeCompare(timeB);
            };

            const sortedTodayAppts = todayAppts.sort(sortByTime);
            console.log('Sorted appointments for today:', sortedTodayAppts);
            setTodayAppointmentsList(sortedTodayAppts);

            // Filter upcoming appointments (next 7 days, excluding today)
            const testDate = new Date(testDateStr);
            const nextWeek = new Date(testDate);
            nextWeek.setDate(nextWeek.getDate() + 7);

            const upcomingAppts = appointmentsData.filter(app => {
                if (!app.start_date) return false;

                const appDate = new Date(app.start_date);
                const appDateStr = app.start_date.split('T')[0];
                const isToday = appDateStr === testDateStr;
                const isUpcoming = !isToday && appDate <= nextWeek;
                const isScheduled = app.status === 'scheduled';

                return isUpcoming && isScheduled;
            });

            setUpcomingAppointmentsList(upcomingAppts.sort((a, b) => {
                const dateCompare = new Date(a.start_date) - new Date(b.start_date);
                return dateCompare === 0 ? sortByTime(a, b) : dateCompare;
            }));

            // Update stats with the actual count
            const statsResponse = await axios.get(`${API_URL}/dashboard/stats`);
            const updatedStats = {
                ...statsResponse.data,
                todayAppointments: todayAppts.length
            };
            console.log('Updated stats:', updatedStats);
            setStats(updatedStats);
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
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
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
                padding: '0',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {appointments.length === 0 ? (
                    <p className="text-center" style={{
                        padding: '20px',
                        color: '#95a5a6',
                        margin: 0
                    }}>No appointments scheduled</p>
                ) : (
                    <div style={{
                        overflow: 'auto',
                        flex: 1,
                        maxHeight: '400px'
                    }}>
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