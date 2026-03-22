
import React from 'react'
import Navbar from './Navbar'
import StatusColor  from './StatusColor';
import { FaExclamationTriangle } from 'react-icons/fa';

function Sensor({mockData, setActivePage}) {
    const [selectedBuilding, setSelectedBuilding] = React.useState(null);
    const[filter, setFilter] = React.useState("all");

    const filteredData = mockData.filter(room => {
        if(filter === "all") return true;
        if(filter === "green") return room.co2Value !== null && room.co2Value <= 800;
        if(filter === "yellow") return room.co2Value !== null && room.co2Value > 800 && room.co2Value <= 1000;
        if(filter === "red") return room.co2Value !== null && room.co2Value > 1000;
        if(filter === "feil") return room.status === "Feil med sensor";
    })
    const buildingNames = [...new Set(filteredData.map(item => item.building))];
    return (
    <div>
        <Navbar activePage="sensor" setActivePage={setActivePage} />
        <div className="flex gap-4 px-6 mt-4">
            <div className="w-72 shrink-0">
                <select value={filter} onChange={e => {setFilter(e.target.value); setSelectedBuilding(null)}}
                className="mb-4 p-2 border rounded w-full bg-white text-sm cursor-pointer">
                    <option value="all">Alle sensorer</option>
                    <option value="green">Normalt (under 800)</option>
                    <option value="yellow">Moderat (801-1000 )</option>
                    <option value="red"> Farlig( over 1000 )</option>
                    <option value="feil">Feil med sensor</option>
                </select>

                {buildingNames.map( name => {
                    const rooms = filteredData.filter(item => item.building === name);
                    let greenCount = 0;
                    let yellowCount = 0;
                    let redCount = 0;
                    let sensorErrorCount = 0;
                    rooms.forEach(room => {
                        if(room.status == "Feil med sensor"){
                            sensorErrorCount++;
                            return;
                        }
                        if (room.co2Value == null) return;
                        if (room.co2Value <= 800) 
                            greenCount++;
                        else if (room.co2Value <= 1000)
                            yellowCount++;
                        else
                            redCount++;
                    });
                    return (
                    <div key={name} onClick={() => setSelectedBuilding(name)}
                    className="bg-gray-300 border rounded p-3 mb-3 cursor-pointer">
                        <p className="text-xl font-semibold mb-2">{name}</p>
                        <p className="text-xs text-gray-500 mb-2">Rom: {rooms.length}</p>
                        <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1"> {greenCount} <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span> </span>
                            <span className="flex items-center gap-1"> {yellowCount} <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span> </span>
                            <span className="flex items-center gap-1"> {redCount} <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span> </span>
                            <span className="flex items-center gap-1"> {sensorErrorCount} <FaExclamationTriangle className="text-yellow-500" /> </span>
                        </div>
                    </div>
                )    
            })}
            </div>
            <div className="flex-1 border border-gray-300 rounded bg-white p-4">
            {selectedBuilding ? (
                <div>
                    <p className=" font-bold mb-4">{selectedBuilding}</p>
                    <div className="grid grid-cols-3 gap-4">
                     {filteredData.filter(room => room.building === selectedBuilding).map(room => (
                        <div key={room.id} className="bg-gray-200 border rounded p-3">
                            <p className="text-sm font-semibold">{room.room}</p>
                            <p className="text-xs text-gray-600 mb-2">{room.floor}</p>
                            <p className="text-xs text-gray-600 mb-2">Sensor ID: {room.sensorId}</p>
                            <p className="text-xs text-gray-600 mb-2">Status: {room.status}</p>
                            <div className="flex items-center justify-between">
                                <span className= "text-sm font-medium"> {room.co2Value ?? "N/A"} </span>
                                <StatusColor status={room.status} co2Value={room.co2Value} />
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            ) : (
                <p className=" text-gray-400">Velg en bygning for å se detaljer</p>    
            )}
     
     
            </div> 
        </div>
    </div>
    

  );
}

export default Sensor
