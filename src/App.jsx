import React , { useState }from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sensor from './Components/Sensor';
import Settings from './Components/Settings';
import Dashboard from "./Components/Dashboard";
import { mockData, mockBuildings } from "./Components/mockData";



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/sensors" element={<Sensor mockData={mockData} />}/>
                <Route path="/settings" element={<Settings buildingData={mockBuildings} mockData={mockData} />}/>
                <Route path="*" element={<Navigate to="/dashboard" />} />
             
               
            </Routes>
        </BrowserRouter>
    );
}

export default App;




