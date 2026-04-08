import React, { useState, useEffect } from 'react';
import CardDetail from './CardDetail';
import Navbar from './Navbar';
import { api } from '../services/api';

function Dashboard() {
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [leaseRooms, setLeaseRooms] = useState([]);
    const [leases, setLeases] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [error, setError] = useState('');
    const [roomsError, setRoomsError] = useState('');

    // Hent all data ved oppstart
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [buildingsData, sensorsData, leaseRoomsData, leasesData, tenantsData] = await Promise.all([
                    api.getBuildings(),
                    api.getSensors(),
                    api.getLeaseRooms(),
                    api.getLeases(),
                    api.getTenants()
                ]);

                const mappedBuildings = buildingsData.map((building) => ({
                    id: building.id,
                    name: building.name,
                    address: `${building.streetName} ${building.streetNumber}`
                }));

                setBuildings(mappedBuildings);
                setSensors(sensorsData);
                setLeaseRooms(leaseRoomsData);
                setLeases(leasesData);
                setTenants(tenantsData);
            } catch (err) {
                setError('Failed to load data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Hent rom når bygning velges
    useEffect(() => {
        const fetchRooms = async () => {
            if (!selectedBuilding) {
                setRooms([]);
                setSelectedCard(null);
                return;
            }

            try {
                setRoomsLoading(true);
                setRoomsError('');
                setSelectedCard(null);

                const data = await api.getRoomsFromBuilding(selectedBuilding);
                setRooms(data);
            } catch (err) {
                setRoomsError('Failed to load rooms');
                console.error(err);
            } finally {
                setRoomsLoading(false);
            }
        };

        fetchRooms();
    }, [selectedBuilding]);

    // Bygg romdetaljer når et rom klikkes
    const handleRoomClick = (room) => {
        const building = buildings.find(b => b.id === parseInt(selectedBuilding));
        const sensor = sensors.find(s => s.roomId === room.id);
        const leaseRoom = leaseRooms.find(lr => lr.roomId === room.id);
        const lease = leaseRoom ? leases.find(l => l.id === leaseRoom.leaseId) : null;
        const tenant = lease ? tenants.find(t => t.id === lease.tenantId) : null;

        const roomDetails = {
            roomId: room.id,
            roomCode: room.roomCode,
            floor: room.roomFloor,
            roomSize: room.roomSize,
            address: building ? building.address : 'Ukjent',
            tenantFirstName: tenant?.firstName || null,
            tenantLastName: tenant?.lastName || null,
            tenantPhone: tenant?.phone || null,
            tenantEmail: tenant?.email || null,
            sensorSerial: sensor?.sensorSerial || null,
            sensorStatus: sensor ? (sensor.sensorStatus ? 'Aktiv' : 'Inaktiv') : 'Ingen sensor'
        };

        setSelectedCard(roomDetails);
    };

    const selectedBuildingData = buildings.find(
        (building) => building.id === parseInt(selectedBuilding)
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div>
                <h1 className="text-4xl p-8 bg-white text-black font-bold mb-6 shadow-lg rounded-b-lg border-b">
                    USN Studentbygg - CO2 Observasjon
                </h1>
                <Navbar />
            </div>

            <div className="flex gap-6 px-8 py-4">
                <div className="w-[420px] p-4">
                    <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-xl">
                        <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">
                            Velg Bygg
                        </h3>
                        <select
                            value={selectedBuilding}
                            onChange={(e) => {
                                setSelectedBuilding(e.target.value);
                            }}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                        >
                            <option value="">Velg et bygg</option>
                            {buildings.map((building) => (
                                <option key={building.id} value={building.id}>
                                    {building.name} - {building.address}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedBuilding && (
                        <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-xl">
                            <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">
                                {selectedBuildingData?.name} - Rom
                            </h3>

                            <div className="space-y-3">
                                {roomsLoading && (
                                    <p className="text-gray-500">Laster rom...</p>
                                )}

                                {roomsError && (
                                    <p className="text-red-500">{roomsError}</p>
                                )}

                                {!roomsLoading && !roomsError && rooms.length === 0 && (
                                    <p className="text-gray-500">Ingen rom funnet for dette bygget.</p>
                                )}

                                {!roomsLoading && !roomsError && rooms.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleRoomClick(item)}
                                        className={`w-full text-left p-4 rounded-lg border transition duration-200 ${
                                            selectedCard?.roomId === item.id
                                                ? 'bg-blue-100 border-blue-400'
                                                : 'bg-gray-50 border-gray-200 hover:bg-blue-50'
                                        }`}
                                    >
                                        <div className="font-semibold text-gray-800">
                                            Rom {item.roomCode}
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            Etg. {item.roomFloor}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-6">
                    {selectedCard ? (
                        <CardDetail data={selectedCard} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                Velg et rom fra listen for å se detaljer
                            </p>
                            <div className="mt-4 text-6xl opacity-20">🏢</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;