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
            setSelectedRoom(null);

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

        if (room.sensorId) {
            try {
                const details = await api.getSensorDetails(room.sensorId);
                setSensorDetails(details);

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
                console.error("Feil ved henting av sensordetaljer:", err);
                setSensorDetails(null);
                setSensorLog([]);
            }
        } else {
            setSensorDetails(null);
            setSensorLog([]);
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
                        <option value="green">Normalt (under 800)</option>
                        <option value="yellow">Moderat (800-1000)</option>
                        <option value="red">Farlig (over 1000)</option>
                        <option value="feil">Feil med sensor</option>
                        <option value="ingen">Ingen sensor</option>
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
                                {roomCards.map(room => (
                                    <div
                                        key={`${room.id}-${room.sensorId}`}
                                        onClick={() => handleRoomSelect(room)}
                                        className={`border rounded p-3 cursor-pointer transition ${
                                            selectedRoom?.sensorId === room.sensorId
                                                ? "bg-blue-100 border-blue-400"
                                                : "bg-gray-200 hover:bg-gray-100"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold">Rom {room.roomCode}</p>
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