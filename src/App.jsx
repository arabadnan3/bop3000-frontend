import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Components/Dashboard";
import Sensors from "./Components/Sensors";
import Settings from "./Components/Settings";
import { mockData, mockBuildings } from "./Components/mockData";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/dashboard" element={<Dashboard mockData={mockData} />}/>
                <Route path="/sensors" element={<Sensors mockData={mockData} />}/>
                <Route path="/settings" element={<Settings buildingData={mockBuildings} />}/>
                <Route path="*" element={<Navigate to="/dashboard" />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;