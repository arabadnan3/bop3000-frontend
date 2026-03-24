import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa';

function statusColor(status, co2Value) {
  if (status === "Feil med sensorr") {
    return <FaExclamationTriangle className="text-yellow-500 text-xl" />;
  }
  if (co2Value !== null) {
    let circleColor = "";

    if (co2Value <= 800) {
      circleColor = "bg-green-500";
    } else if (co2Value <= 1000) {
      circleColor = "bg-yellow-500";
    } else {
      circleColor = "bg-red-500";
    }
    return (
      <span className={`inline-block w-3 h-3 rounded-full ${circleColor} mr-2`}>

      </span>
    );
  }
  
}

function Card({ building, room, floor, status, co2Value }) {
  return (
    <div className="bg-gray-300 p-2 border rounded shadow-sm mb-2 w-80 h-auto">
      <p className="font-bold text-lg text-black mb-2">{building}
      </p>
      
      <p className="text-sm text-gray-700 mb-1">{room}
      </p>
      <p className="text-sm text-gray-700 mb-1">{floor}
      </p>

      <div className="flex items-center gap-1 mb-2">
        <p className="text-sm text-gray-700 mb-1">{status}

        </p>
        {statusColor(status, co2Value)}
      </div>
      <p className="text-sm text-gray-700 mb-1">
        {co2Value ? `CO2 Verdi: ${co2Value}` : "CO2 Verdi: ikke tilgjengelig"}
      </p>
    </div>
  )
}

export default Card
