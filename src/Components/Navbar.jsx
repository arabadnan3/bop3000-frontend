import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaTachometerAlt, FaMicrochip, FaExclamationTriangle } from 'react-icons/fa'
import { FaGear } from "react-icons/fa6"

function Navbar() {
    const location = useLocation()

    const base =
        "flex items-center gap-2 text-lg font-semibold px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200"

    const active = "bg-blue-500 text-white"
    const normal = "bg-gray-100 text-gray-700"



    return (
        <div>
            <h1 className="text-4xl p-8 bg-white text-black font-bold mb-6 shadow-lg rounded-b-lg border-b">
                USN Studentbygg - CO2 Observasjon
            </h1>

            <div className="flex flex-wrap gap-4 px-8 py-4 bg-white shadow-md rounded-lg mx-8 mb-6">


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
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-red-600"
                    }`}
                >
                    <FaExclamationTriangle /> Varslinger
                </Link>

            </div>
        </div>
    )
}

export default Navbar

