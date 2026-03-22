
import React from 'react'
import StatusColor from './StatusColor';


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
        <StatusColor status={status} co2Value={co2Value} />
      </div>
      <p className="text-sm text-gray-700 mb-1">
        {co2Value ? `CO2 Verdi: ${co2Value}` : "CO2 Verdi: ikke tilgjengelig"}
      </p>
    </div>
  )
}

export default Card
