import {
    React
} from 'react';
import { SideBar } from './Components/SideBar';
import { Dashboard } from './Views/Dashboard';
import { Clients } from './Views/Clients';
import { Pets } from './Views/Pets';
import { Appointments } from './Views/Appointments';
// import { Files } from "./views/Files";
// import { Manage } from "./views/Manage";
// import { Tools } from "./views/Tools";
import {
    Route,
    Routes
} from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

export const RoutesTemplate = () => {
    return (
        <div style={{
            margin: 0,
            padding: 0,
            minHeight: "100vh",
            backgroundColor: "#f5f6fa",
            position: "relative",
            overflow: "hidden"
        }}>
            <Row style={{ margin: 0, height: "100vh" }}>
                <Col
                    xl={2}
                    lg={2}
                    md={3}
                    sm={4}
                    style={{
                        position: 'fixed',
                        height: '100vh',
                        padding: 0,
                        zIndex: 1000
                    }}
                >
                    <SideBar />
                </Col>
                <Col
                    xl={10}
                    lg={10}
                    md={9}
                    sm={8}
                    style={{
                        marginLeft: '16.666667%',
                        padding: "20px",
                        backgroundColor: "#f5f6fa",
                        minHeight: "100vh",
                        position: "relative",
                        zIndex: 1
                    }}
                >
                    <Routes>
                        <Route path="/Dashboard" element={<Dashboard />} />
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/Clients" element={<Clients />} />
                        <Route path="/Pets" element={<Pets />} />
                        <Route path="/Appointments" element={<Appointments />} />
                    </Routes>
                </Col>
            </Row>
        </div>
    );
};