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
    <div className="bg-slate-950 min-h-screen">
        <Navbar/>

        <div className="bg-slate-800 px-6 pt-6 min-h-screen border-t border-slate-700">

            <div className="flex items-center border-b border-slate-700 pb-3 mb-4">
                <p className="text-lg font-bold underline text-white">Varslinger</p>
            </div>

            <div className="flex gap-2 mb-4">
                {[
                    { key: "alle", label: `Alle (${activeAlerts.length}) `},
                    { key: "critical", label: `Critical (${criticalCount})`},
                    { key: "warning", label: `Warning (${warningCount})`},
                ].map(({key,label}) => (
                    <button key={key} onClick={() => setFilter(key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border cursor-pointer transition duration-200 ${
                        filter === key
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
                    }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col"> 
                {filtered.length === 0 ? (
                    <p className="text-slate-400 text-center mt-20"> Ingen aktive varslinger </p>
                ) : (
                    filtered.map((room, index) => {
                        const isExpanded = expandedId === room.sensorId;
                        const isCritical = room.severity === "CRITICAL";

                        return(
                            <div 
                                key={`${room.id} - ${index} `} 
                                className={`border-b border-slate-700 py-4 px-2 ${
                                    isCritical ? "bg-slate-700/50" : "bg-slate-700/30"

                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-4 h-4 rounded-full shrink-0 ${
                                            isCritical ? "bg-red-500" : "bg-yellow-400"
                                        }`}>

                                        </div>
                                        <div>
                                            <p className="font-bold text-white">
                                                {room.building} - {room.room}

                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {room.sensorSerial} - {room.floor}

                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                            isCritical ? "bg-red-600/40 text-red-300" : "bg-yellow-600/40 text-yellow-300"
                                        }`}>
                                            {room.severity}  
                                        </span>
                                        <p className={`text-xl font-bold ${
                                            isCritical ? "text-red-400" : "text-yellow-400"
                                        }`}>
                                            {room.co2Value} ppm

                                        </p>
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : room.sensorId)}
                                            className="text-sm text-slate-400 underline cursor-pointer hover:text-slate-200 transition duration-200"
                                        >
                                            {isExpanded ? "Lukk" : "Se detaljer"}

                                        </button>


                                    </div>
                            </div>

                            {isExpanded && (
                                <div className="mt-3 ml-8 p-3 bg-slate-700 border border-slate-600 rounded-lg flex flex-col gap-2">
                                    <p className="text-sm text-slate-100">
                                        <span className="font-bold">Sensor ID: </span>
                                            {room.sensorId}

                                    </p>
                                    <p className="text-sm text-slate-100">
                                        <span className="font-bold">CO2 verdi: </span>
                                            {""}
                                        <span className={`font-bold ${
                                            isCritical ? "text-red-400" : "text-yellow-400"
                                        }`}>
                                            {room.co2Value} ppm
                                        </span>    
                                            
                                    </p>
                                    <p className="text-sm text-slate-100">
                                        <span className="font-bold">Severity: </span>
                                        <span className={`font-bold ${
                                            isCritical ? "text-red-400" : "text-yellow-400"
                                        }`}>
                                            {room.severity}
                                        </span>
                                    </p>
                                    <div className="border-t border-slate-600 my-1">
                                        <p className="text-xs text-slate-400 font-semibold uppercase"> Leietaker</p>
                                        <p className="text-sm text-slate-100">
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
