import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import StatusColor from './StatusColor';
import { FaExclamationTriangle } from 'react-icons/fa';
import { api } from '../services/api';

function Sensors() {
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [filter, setFilter] = useState("all");
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [sensorData, setSensorData] = useState([]);
    const [sensorLog, setSensorLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSensorData();
    }, []);

    const fetchSensorData = async () => {
        try {
            setLoading(true);

            const [rooms, buildings, sensors, sensorReadings, sensorRules, leaseRooms, leases, tenants] = await Promise.all([
                api.getRooms(),
                api.getBuildings(),
                api.getSensors(),
                api.getSensorReadings(),
                api.getSensorRules(),
                api.getLeaseRooms(),
                api.getLeases(),
                api.getTenants()
            ]);

            const combinedData = rooms.map(room => {
                const building = buildings.find(b => b.id === room.buildingId);
                // Koble sensor til rom via roomId
                const sensor = sensors.find(s => s.roomId === room.id);
                const leaseRoom = leaseRooms.find(lr => lr.room?.id === room.id);
                const lease = leaseRoom ? leases.find(l => l.id === leaseRoom.lease?.id) : null;
                const tenant = lease ? tenants.find(t => t.id === lease.tenant?.id) : null;

                // Hent siste CO2-verdi for denne sensoren
                let co2Value = null;
                let status = "Ingen sensor";

                if (sensor) {
                    // Finn alle readings for denne sensoren via sensorId
                    const readings = sensorReadings
                        .filter(r => r.sensorId === sensor.id)
                        .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

                    if (readings.length > 0) {
                        co2Value = readings[0].value;
                    }

                    // Finn regler for denne sensoren via sensorId
                    const rules = sensorRules.filter(r => r.sensorId === sensor.id && r.active);
                    const warningRule = rules.find(r => r.ruleSeverity === 'WARNING');
                    const criticalRule = rules.find(r => r.ruleSeverity === 'CRITICAL');

                    // Bestem status basert på sensor og regler
                    if (sensor.sensorStatus === false) {
                        status = "Feil med sensor";
                    } else if (co2Value !== null) {
                        if (criticalRule && co2Value > criticalRule.ruleThreshold) {
                            status = "Farlig CO2 Nivå!";
                        } else if (warningRule && co2Value > warningRule.ruleThreshold) {
                            status = "Moderat CO2 Nivå";
                        } else {
                            status = "Normalt CO2 Nivå";
                        }
                    } else {
                        status = "Normalt CO2 Nivå";
                    }
                }

                return {
                    id: room.id,
                    building: building ? `${building.name} (${building.streetName} ${building.streetNumber})` : 'Ukjent',
                    room: `Rom ${room.roomCode}`,
                    floor: `${room.roomFloor}. Etg.`,
                    status: status,
                    co2Value: co2Value,
                    leietaker: tenant ? `${tenant.first_name} ${tenant.last_name}` : 'Ingen leietaker',
                    areal: room.roomSize,
                    sensorId: sensor ? sensor.id : null,
                    sensorSerial: sensor ? sensor.sensorSerial : null,
                    sensorBattery: sensor ? sensor.sensorBattery : null,
                    sensorStatus: sensor ? sensor.sensorStatus : null,
                    sensorType: sensor ? sensor.sensorType : null
                };
            });

            setSensorData(combinedData);
            setError(null);
        } catch (err) {
            console.error('Feil ved henting av data:', err);
            setError('Kunne ikke hente data fra serveren');
        } finally {
            setLoading(false);
        }
    };

    // Hent sensorlogg når et rom velges
    const handleRoomSelect = async (room) => {
        setSelectedRoom(room);

        if (room.sensorId) {
            try {
                const readings = await api.getSensorReadingsBySensor(room.sensorId);
                const sortedReadings = readings
                    .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
                    .slice(0, 24)
                    .map(r => ({
                        id: r.id,
                        timestamp: r.timeStamp,
                        ppm: r.value
                    }));
                setSensorLog(sortedReadings);
            } catch (err) {
                console.error('Feil ved henting av sensorlogg:', err);
                setSensorLog([]);
            }
        } else {
            setSensorLog([]);
        }
    };

    const filteredData = sensorData.filter(room => {
        if (filter === "all") return true;
        if (filter === "green") return room.co2Value !== null && room.co2Value <= 800;
        if (filter === "yellow") return room.co2Value !== null && room.co2Value > 800 && room.co2Value <= 1000;
        if (filter === "red") return room.co2Value !== null && room.co2Value > 1000;
        if (filter === "feil") return room.status === "Feil med sensor";
        if (filter === "ingen") return room.status === "Ingen sensor";
        return true;
    });

    const buildingNames = [...new Set(filteredData.map(item => item.building))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Laster sensordata...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div>
                <h1 className="text-4xl p-8 bg-white text-black font-bold mb-6 shadow-lg rounded-b-lg border-b">
                    USN Studentbygg - CO2 Observasjon
                </h1>
            </div>
            <Navbar />
            <div className="flex gap-4 px-6 mt-4">
                <div className="w-72 shrink-0">
                    <select
                        value={filter}
                        onChange={e => { setFilter(e.target.value); setSelectedBuilding(null); setSelectedRoom(null); }}
                        className="mb-4 p-2 border rounded w-full bg-white text-sm cursor-pointer"
                    >
                        <option value="all">Alle sensorer</option>
                        <option value="green">Normalt (under 800)</option>
                        <option value="yellow">Moderat (800-1000)</option>
                        <option value="red">Farlig (over 1000)</option>
                        <option value="feil">Feil med sensor</option>
                        <option value="ingen">Ingen sensor</option>
                    </select>

                    {buildingNames.map(name => {
                        const rooms = filteredData.filter(item => item.building === name);
                        let greenCount = 0;
                        let yellowCount = 0;
                        let redCount = 0;
                        let sensorErrorCount = 0;

                        rooms.forEach(room => {
                            if (room.status === "Feil med sensor") {
                                sensorErrorCount++;
                                return;
                            }
                            if (room.status === "Ingen sensor") {
                                return;
                            }
                            if (room.co2Value === null) {
                                greenCount++;
                                return;
                            }
                            if (room.co2Value <= 800)
                                greenCount++;
                            else if (room.co2Value <= 1000)
                                yellowCount++;
                            else
                                redCount++;
                        });

                        return (
                            <div
                                key={name}
                                onClick={() => { setSelectedBuilding(name); setSelectedRoom(null); }}
                                className={`border rounded p-3 mb-3 cursor-pointer transition ${selectedBuilding === name
                                    ? 'bg-blue-100 border-blue-400'
                                    : 'bg-gray-300 hover:bg-gray-200'
                                }`}
                            >
                                <p className="text-xl font-semibold mb-2">{name}</p>
                                <p className="text-xs text-gray-500 mb-2">Rom: {rooms.length}</p>
                                <div className="flex gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                        {greenCount} <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {yellowCount} <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {redCount} <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {sensorErrorCount} <FaExclamationTriangle className="text-yellow-500" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-1 border border-gray-300 rounded bg-white p-4">
                    {selectedBuilding ? (
                        <div>
                            <p className="font-bold mb-4 text-xl">{selectedBuilding}</p>
                            <div className="grid grid-cols-3 gap-4">
                                {filteredData.filter(room => room.building === selectedBuilding).map(room => (
                                    <div
                                        key={room.id}
                                        onClick={() => handleRoomSelect(room)}
                                        className={`border rounded p-3 cursor-pointer transition ${selectedRoom?.id === room.id
                                            ? 'bg-blue-100 border-blue-400'
                                            : 'bg-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        <p className="text-sm font-semibold">{room.room}</p>
                                        <p className="text-xs text-gray-600 mb-2">{room.floor}</p>
                                        <p className="text-xs text-gray-600 mb-1">
                                            Sensor: {room.sensorSerial ?? "Ingen"}
                                        </p>
                                        <p className="text-xs text-gray-600 mb-1">
                                            Type: {room.sensorType ?? "N/A"}
                                        </p>
                                        <p className="text-xs text-gray-600 mb-2">
                                            Batteri: {room.sensorBattery ? `${room.sensorBattery}%` : "N/A"}
                                        </p>
                                        <p className="text-xs text-gray-600 mb-2">Status: {room.status}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                {room.co2Value ? `${Math.round(room.co2Value)} ppm` : "N/A"}
                                            </span>
                                            <StatusColor status={room.status} co2Value={room.co2Value} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedRoom && (
                                <div className="mt-6">
                                    <div className="p-4 bg-gray-100 rounded-lg mb-4">
                                        <p className="text-lg font-bold mb-4">Sensordetaljer for {selectedRoom.room}</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p><span className="font-semibold">Bygning:</span> {selectedRoom.building}</p>
                                                <p><span className="font-semibold">Etasje:</span> {selectedRoom.floor}</p>
                                                <p><span className="font-semibold">Areal:</span> {selectedRoom.areal} m²</p>
                                                <p><span className="font-semibold">Leietaker:</span> {selectedRoom.leietaker}</p>
                                            </div>
                                            <div>
                                                <p><span className="font-semibold">Sensor ID:</span> {selectedRoom.sensorId ?? "Ingen"}</p>
                                                <p><span className="font-semibold">Serial:</span> {selectedRoom.sensorSerial ?? "N/A"}</p>
                                                <p><span className="font-semibold">Type:</span> {selectedRoom.sensorType ?? "N/A"}</p>
                                                <p><span className="font-semibold">Batteri:</span> {selectedRoom.sensorBattery ? `${selectedRoom.sensorBattery}%` : "N/A"}</p>
                                                <p><span className="font-semibold">Status:</span> {selectedRoom.sensorStatus ? "Aktiv" : "Inaktiv"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {sensorLog.length > 0 && (
                                        <div>
                                            <p className="text-lg font-bold mb-2">Sensorlogg for {selectedRoom.room}</p>
                                            <div className="overflow-y-scroll max-h-72 border border-gray-300 rounded">
                                                {sensorLog.map((reading, index) => (
                                                    <div key={reading.id || index} className="flex items-center px-3 py-3 bg-gray-200 border-b">
                                                        <p className="w-52 font-bold">
                                                            {new Date(reading.timestamp).toLocaleString('no-NO')}
                                                        </p>
                                                        <p className="flex-1 font-bold">{Math.round(reading.ppm)} ppm</p>
                                                        <span className={`w-4 h-4 rounded-full ${reading.ppm > 1000 ? "bg-red-500" :
                                                            reading.ppm > 800 ? "bg-yellow-400" : "bg-green-500"
                                                        }`}>
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-400">Velg en bygning for å se detaljer</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sensors;