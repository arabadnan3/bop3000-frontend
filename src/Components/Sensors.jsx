import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import StatusColor from './StatusColor';
import { FaExclamationTriangle } from 'react-icons/fa';
import { api } from '../services/api';

function Sensors() {
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [filter, setFilter] = useState("all");
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [buildingCards, setBuildingCards] = useState([]);
    const [sensorDetails, setSensorDetails] = useState(null);
    const [roomCards, setRoomCards] = useState([]);
    const [sensorLog, setSensorLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBuildingCards();
    }, []);

    const fetchBuildingCards = async () => {
        try {
            setLoading(true);

            const data = await api.getBuildingCards();
            setBuildingCards(data);

            setError(null);
        } catch (err) {
            console.error("Feil ved henting av bygninger:", err);
            setError("Kunne ikke hente bygninger fra serveren");
        } finally {
            setLoading(false);
        }
    };

    const handleBuildingSelect = async (building) => {
        try {
            setSelectedBuilding(building);

            // Reset selected room + sensor data
            setSelectedRoom(null);
            setSensorDetails(null);
            setSensorLog([]);

            const rooms = await api.getRoomCards(building.id);
            setRoomCards(rooms);

        } catch (err) {
            console.error("Feil ved henting av rom:", err);
            setRoomCards([]);
        }
    };

    // Hent sensorlogg når et rom velges
    const handleRoomSelect = async (room) => {
        setSelectedRoom(room);
        setSensorDetails(null);
        setSensorLog([]);

        if (room.sensorId) {
            try {
                const details = await api.getSensorDetails(room.sensorId);
                setSensorDetails(details);

                const readings = await api.getSensorReadingsFrom24Hours(room.sensorId);

                const mappedReadings = readings.map((r, index) => ({
                    id: index,
                    timestamp: r.hour,
                    ppm: r.avgValue,
                    severity: r.severityLevel
                }));

                setSensorLog(mappedReadings);
            } catch (err) {
                console.error("Feil ved henting av sensordata:", err);
                setSensorDetails(null);
                setSensorLog([]);
            }
        }
    };

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

    const filteredRooms = roomCards.filter((room) => {

        if (filter === "all") {
            return true;
        }

        if (filter === "green") {
            return room.severityLevel === "GREEN";
        }

        if (filter === "yellow") {
            return room.severityLevel === "YELLOW";
        }

        if (filter === "red") {
            return room.severityLevel === "RED";
        }

        if (filter === "feil") {
            return room.sensorStatus === false;
        }

        return true;
    });

    return (
        <div>
            <Navbar />
            <div className="flex gap-4 px-6 mt-4">
                <div className="w-72 shrink-0">
                    <select
                        value={filter}
                        onChange={e => { setFilter(e.target.value); setSelectedBuilding(null); setSelectedRoom(null); }}
                        className="mb-4 p-2 border rounded w-full bg-white text-sm cursor-pointer"
                    >
                        <option value="all">Alle sensorer</option>
                        <option value="green">Normalt</option>
                        <option value="yellow">Moderat</option>
                        <option value="red">Farlig</option>
                        <option value="feil">Feil med sensor</option>
                    </select>

                    {buildingCards.map(building => {
                        return (
                            <div
                                key={building.id}
                                onClick={() => handleBuildingSelect(building)}
                                className={`border rounded p-3 mb-3 cursor-pointer transition ${
                                    selectedBuilding?.id === building.id
                                        ? "bg-blue-100 border-blue-400"
                                        : "bg-gray-300 hover:bg-gray-200"
                                }`}
                            >
                                <p className="text-xl font-semibold mb-2">
                                    {building.buildingName} ({building.streetName} {building.streetNumber})
                                </p>

                                <p className="text-xs text-gray-500 mb-2">
                                    Sensorer: {building.sensorCount}
                                </p>

                                <div className="flex gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    {building.greenThresholdCount}
                                    <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                                 </span>
                                 <span className="flex items-center gap-1">
                                     {building.yellowThresholdCount}
                                     <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                                 </span>
                                    <span className="flex items-center gap-1">
                                        {building.redThresholdCount}
                                        <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-1 border border-gray-300 rounded bg-white p-4">
                    {selectedBuilding ? (
                        <div>
                            <p className="font-bold mb-4 text-xl">
                                {selectedBuilding.buildingName}
                            </p>

                            <div className="grid grid-cols-3 gap-4">
                                {filteredRooms.map(room => (
                                    <div
                                        key={`${room.id}-${room.sensorId}`}
                                        onClick={() => handleRoomSelect(room)}
                                        className={`border rounded p-3 cursor-pointer transition ${
                                            selectedRoom?.sensorId === room.sensorId
                                                ? "bg-blue-100 border-blue-400"
                                                : "bg-gray-200 hover:bg-gray-100"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-semibold">Rom {room.roomCode}</p>

                                            <span
                                                className={`w-4 h-4 rounded-full ${
                                                    room.severityLevel === "RED"
                                                        ? "bg-red-500"
                                                        : room.severityLevel === "YELLOW"
                                                            ? "bg-yellow-400"
                                                            : "bg-green-500"
                                                }`}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">{room.roomFloor}. Etg.</p>
                                        <p className="text-xs text-gray-600 mb-1">Sensor serial: {room.sensorSerial ?? "Missing"}</p>
                                        <p className="text-xs text-gray-600 mb-1">Type: {room.sensorType}</p>
                                        <p className="text-xs text-gray-600 mb-2">Batteri: {room.sensorBattery}%</p>
                                        <p className="text-sm font-medium">{Math.round(room.readingValue)} ppm</p>
                                    </div>
                                ))}
                            </div>
                            {sensorDetails && (
                                <div className="mt-6">
                                    <div className="p-4 bg-gray-100 rounded-lg mb-4">
                                        <p className="text-lg font-bold mb-4">
                                            Sensordetaljer for Rom {sensorDetails.roomCode}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p><span className="font-semibold">Bygning:</span> {sensorDetails.buildingName}</p>
                                                <p><span className="font-semibold">Adresse:</span> {sensorDetails.streetName} {sensorDetails.streetNumber}</p>
                                                <p><span className="font-semibold">Etasje:</span> {sensorDetails.roomFloor} etg.</p>
                                                <p><span className="font-semibold">Areal:</span> {sensorDetails.roomSize} m²</p>
                                                <p>
                                                    <span className="font-semibold">Leietaker:</span>{" "}
                                                    {sensorDetails.tenantFirstName || sensorDetails.tenantLastName
                                                        ? `${sensorDetails.tenantFirstName ?? ""} ${sensorDetails.tenantLastName ?? ""}`
                                                        : "Ingen"}
                                                </p>
                                            </div>

                                            <div>
                                                <p><span className="font-semibold">Sensor serienr:</span> {sensorDetails.sensorSerial ?? "N/A"}</p>
                                                <p><span className="font-semibold">Type:</span> {sensorDetails.sensorType ?? "N/A"}</p>
                                                <p><span className="font-semibold">Batteri:</span> {sensorDetails.sensorBattery ?? "N/A"}%</p>
                                                <p><span className="font-semibold">Status:</span> {sensorDetails.sensorStatus ? "Aktiv" : "Inaktiv"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {sensorLog.length > 0 && (
                                        <div>
                                            <p className="text-lg font-bold mb-2">
                                                Sensorlogg for Rom {selectedRoom.roomCode}
                                            </p>

                                            <div className="overflow-y-scroll max-h-72 border border-gray-300 rounded">
                                                {sensorLog.map((reading, index) => (
                                                    <div key={reading.id || index} className="flex items-center px-3 py-3 bg-gray-200 border-b">
                                                        <p className="w-52 font-bold">
                                                            {new Date(reading.timestamp).toLocaleString("no-NO")}
                                                        </p>

                                                        <p className="flex-1 font-bold">
                                                            {Math.round(reading.ppm)} ppm
                                                        </p>

                                                        <span className={`w-4 h-4 rounded-full ${
                                                            reading.severity === "RED"
                                                                ? "bg-red-500"
                                                                : reading.severity === "YELLOW"
                                                                    ? "bg-yellow-400"
                                                                    : "bg-green-500"
                                                        }`} />
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