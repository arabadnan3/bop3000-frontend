import React from 'react'
import { FaTachometerAlt, FaMicrochip, FaBell, FaExclamationTriangle } from 'react-icons/fa';
import {FaGear} from "react-icons/fa6";

function Navbar({activePage, setActivePage}) {
  return (
    <div className="flex flex-wrap gap-4 px-8 py-4 bg-white shadow-md rounded-lg mx-8 mb-6">
        <button onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 text-lg font-semibold text-gray-700 px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200">
          <FaTachometerAlt /> Dashboard
        </button>
        <button onClick={() => setActivePage('sensors')} className="flex items-center gap-2 text-lg font-semibold text-gray-700 px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200">
          <FaMicrochip /> Sensor
        </button>
        <button onClick={() => setActivePage('settings')} className="flex items-center gap-2 text-lg font-semibold text-gray-700 px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200">
            <FaGear /> Instillinger
        </button>
        <button onClick={() => setActivePage('warnings')} className="flex items-center gap-2 text-lg font-semibold text-red-600 px-4 py-2  bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200" >
          <FaExclamationTriangle /> VARSLINGER
        </button>

    </div>
  )
}

export default Navbar
