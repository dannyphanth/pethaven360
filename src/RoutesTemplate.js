import { React, 
    // useState,
    // useEffect 
} from 'react';
import { SideBar } from './Components/SideBar';
import { Dashboard } from './Views/Dashboard';
import { Clients } from './Views/Clients';
import { DailyManager } from './Views/Daily Manager';
import { Pets } from './Views/Pets';
import { Appointments } from './Views/Appointments';
// import { Files } from "./views/Files";
// import { Manage } from "./views/Manage";
// import { Tools } from "./views/Tools";
import { 
    Route, 
    Routes, 
    // Link
} from 'react-router-dom';
import { Row , Col} from 'react-bootstrap';

export const RoutesTemplate = () => {

    return (
        <div style={{ margin: "0", padding: "0"}}>
            <Row>
                <Col xl={2} lg={2} md={3} sm={4} xs={6} style={{ margin: "0", padding: "0"}}>
                    <SideBar />
                </Col>
                <Col xl={10} lg={10} md={9} sm={8} xs={6} style={{ margin: "0", padding: "0"}}>
                    <Routes>
                        <Route exact path="/Dashboard" element={<Dashboard />} />
                        <Route exact path="/" element={<Dashboard />}></Route>
                        <Route exact path="/Clients" element={<Clients />} />
                        <Route exact path="/DailyManager" element={<DailyManager />} />
                        <Route exact path='/Pets' element={<Pets />} />
                        <Route exact path='/Appointments' element={<Appointments />} />
                    </Routes>
                </Col>
            </Row>
        </div>
    )
}