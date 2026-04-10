import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaTachometerAlt, FaMicrochip, FaExclamationTriangle } from 'react-icons/fa'
import { FaGear } from "react-icons/fa6"

function Navbar() {
    const location = useLocation()

    const base =
        "flex items-center gap-2 text-lg font-semibold px-4 py-2 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700 transition duration-200"

    const active = "bg-blue-600 text-white border-blue-500"
    const normal = "bg-slate-800 text-slate-100 hover:bg-slate-700"



  return (
    <div>
        <h1 className="text-4xl p-8 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold mb-6 shadow-2xl rounded-b-lg border-b border-slate-700">
                    USN Studentbygg - CO2 Observasjon
        </h1>

        <div className="flex flex-wrap gap-4 px-8 py-4 bg-slate-800 shadow-xl rounded-lg mx-8 mb-6 border border-slate-700">
           

            <Link
                to="/dashboard"
                className={`${base} ${location.pathname === "/dashboard" ? active : normal}`}
            >
                <FaTachometerAlt /> Dashboard
            </Link>

            <Link
                to="/sensors"
                className={`${base} ${location.pathname === "/sensors" ? active : normal}`}
            >
                <FaMicrochip /> Sensor
            </Link>

            <Link
                to="/settings"
                className={`${base} ${location.pathname === "/settings" ? active : normal}`}
            >
                <FaGear /> Innstillinger
            </Link>

            <Link
                to="/warnings"
                className={`${base} ${location.pathname === "/warnings"
                    ? "bg-red-600 text-white border-red-500"
                    : "bg-slate-800 text-red-400 hover:bg-slate-700"
                }`}
            >
                <FaExclamationTriangle /> Varslinger
            </Link>

        </div>
    </div>
    )
}

export default Navbar

       