import React from 'react'
import { FaTachometerAlt, FaMicrochip, FaBell, FaExclamationTriangle } from 'react-icons/fa';

function Navbar() {
  return (
    <div className="flex flex-wrap gap-4 px-8 py-4 bg-white shadow-md rounded-lg mx-8 mb-6">
        <button className="flex items-center gap-2 text-lg font-semibold text-gray-700 px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200">
          <FaTachometerAlt /> Dashboard
        </button>
        <button className="flex items-center gap-2 text-lg font-semibold text-gray-700 px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200">
          <FaMicrochip /> Sensor
        </button>
        <button className="flex items-center gap-2 text-lg font-semibold text-gray-700 px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200">
          <FaBell /> Notifikasjoner
        </button> 
        <div className="flex items-center gap-2 text-lg font-semibold text-red-600 px-4 py-2">
          <FaExclamationTriangle /> VARSLINGER
        </div>
      
    </div>
  )
}

export default Navbar
