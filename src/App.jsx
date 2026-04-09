import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Components/Dashboard";
import Sensors from "./Components/Sensors";
import Settings from "./Components/Settings";
import Warnings from "./Components/Warnings.jsx";
import { mockData, mockBuildings, sensorAlerts } from "./Components/mockData";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/sensors" element={<Sensors mockData={mockData} />}/>
                <Route path="/settings" element={<Settings buildingData={mockBuildings} mockData={mockData} />}/>
                <Route path="/warnings" element={<Warnings sensorAlerts= {sensorAlerts} mockData={mockData} />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;