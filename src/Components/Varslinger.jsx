import React, { useState } from 'react'
import Navbar from './Navbar';
import { sensorAlerts} from './mockData';



function Varslinger() {

const [filter, setFilter ] = useState("alle");
const [expandedId, setExpandedId] = useState(null);

const activeAlerts = sensorAlerts;
const filtered = activeAlerts.filter(room => {
    if(filter === "alle") return true;
    if(filter === "critical") return room.severity === "CRITICAL";
    if(filter === "warning") return room.severity === "WARNING";
    
});

const criticalCount = activeAlerts.filter(alert => alert.severity === "CRITICAL").length;
const warningCount = activeAlerts.filter(alert => alert.severity ==="WARNING").length;



  return (
    <div className="bg-gray-100 min-h-screen">
        <Navbar/>

        <div className="bg-white px-6 pt-6 min-h-screen">

            <div className=" flex items-center border-b border-gray-300 pb-3 mb-4">
                <p className="text-lg font-bold underline">Varslinger</p>
            </div>

            <div className="flex gap-2 mb-4">
                {[
                    { key: "alle", label: `Alle (${activeAlerts.length}) `},
                    { key: "critical", label: `Critical (${criticalCount})`},
                    { key: "warning", label: `Warning (${warningCount})`},
                ].map(({key,label}) => (
                    <button key={key} onClick={() => setFilter(key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border cursor-pointer ${
                        filter === key
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col"> 
                {filtered.length === 0 ? (
                    <p className="text-gray-400 text-center mt-20"> Ingen aktive varslinger </p>
                ) : (
                    filtered.map((room, index) => {
                        const isExpanded = expandedId === room.sensorId;
                        const isCritical = room.severity === "CRITICAL";

                        return(
                            <div 
                                key={`${room.id} - ${index} `} 
                                className={`border-b border-gray-200 py-4 px-2 ${
                                    isCritical ? "bg-red-50" : "bg-yellow-50"

                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-4 h-4 rounded-full shrink-0 ${
                                            isCritical ? "bg-red-500" : "bg-yellow-400"
                                        }`}>

                                        </div>
                                        <div>
                                            <p className="font-bold">
                                                {room.building} - {room.room}

                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {room.sensorSerial} - {room.floor}

                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                            isCritical ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                            {room.severity}  
                                        </span>
                                        <p className={`text-xl font-bold ${
                                            isCritical ? "text-red-600" : "text-yellow-600"
                                        }`}>
                                            {room.co2Value} ppm

                                        </p>
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : room.sensorId)}
                                            className="text-sm text-gray-500 underline cursor-pointer hover:text-black"
                                        >
                                            {isExpanded ? "Lukk" : "Se detaljer"}

                                        </button>


                                    </div>
                            </div>

                            {isExpanded && (
                                <div className="mt-3 ml-8 p-3 bg-white border border-gray-200 rounded flex flex-col gap-2">
                                    <p className="text-sm">
                                        <span className="font-bold">Sensor ID: </span>
                                            {room.sensorId}

                                    </p>
                                    <p className="text-sm">
                                        <span className="font-bold">CO2 verdi: </span>
                                            {""}
                                        <span className={`font-bold ${
                                            isCritical ? "text-red-600" : "text-yellow-600"
                                        }`}>
                                            {room.co2Value} ppm
                                        </span>    
                                            
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-bold">Severity: </span>
                                        <span className={`font-bold ${
                                            isCritical ? "text-red-600" : "text-yellow-600"
                                        }`}>
                                            {room.severity}
                                        </span>
                                    </p>
                                    <div className="border-t border-gray-200 my-1">
                                        <p className="text-xs text-gray-400 font-semibold uppercase"> Leietaker</p>
                                        <p className="text-sm">
                                            <span className="font-bold">Navn: </span>
                                            {room.leietaker}
                                        </p>

                                        

                                        

                                    </div>

                                </div>
                            )

                            }
                                       


                            </div>
                        );

                    })
                )}
            </div>

                
        </div>


    </div>

      
    
  );
}

export default Varslinger
