import React, { useState, useEffect } from 'react';
import CardDetail from './CardDetail';
import Navbar from './Navbar';
import { api } from '../services/api';

function Dashboard() {
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [cardLoading, setCardLoading] = useState(false);
    const [error, setError] = useState('');
    const [roomsError, setRoomsError] = useState('');
    const [cardError, setCardError] = useState('');

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const data = await api.getBuildings();

                const mappedBuildings = data.map((building) => ({
                    id: building.id,
                    name: building.name,
                    address: `${building.streetName} ${building.streetNumber}`
                }));

                setBuildings(mappedBuildings);
            } catch (err) {
                setError('Failed to load buildings');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBuildings();
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            if (!selectedBuilding) {
                setRooms([]);
                setSelectedCard(null);
                setCardError('');
                return;
            }

            try {
                setRoomsLoading(true);
                setRoomsError('');
                setSelectedCard(null);
                setCardError('');

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

    const handleRoomClick = async (roomId) => {
        console.log('Clicked roomId:', roomId);

        try {
            setCardLoading(true);
            setCardError('');

            const roomDetails = await api.getRoomDetails(roomId);
            const sensors = await api.getSensorsFromRoom(roomId);

            const sensorsWithLatestReading = await Promise.all(
                sensors.map(async (sensor) => {
                    try {
                        const latestReading = await api.getLatestReading(sensor.id);

                        return {
                            ...sensor,
                            latestReading
                        };
                    } catch (err) {
                        console.error(`Failed to load latest reading for sensor ${sensor.id}`, err);

                        return {
                            ...sensor,
                            latestReading: null
                        };
                    }
                })
            );

            console.log('Room details response:', roomDetails);

            setSelectedCard({
                ...roomDetails,
                sensors: sensorsWithLatestReading
            });
        } catch (err) {
            setCardError('Failed to load room details');
            console.error(err);
        } finally {
            setCardLoading(false);
        }
    };

    const selectedBuildingData = buildings.find(
        (building) => building.id === selectedBuilding
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <Navbar />
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
                                        onClick={() => handleRoomClick(item.id)}
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

                                        <div className="text-sm mt-1">
                                            {item.status === 'Farlig Co2 Nivå!' && (
                                                <span className="text-red-600 font-medium">{item.status}</span>
                                            )}
                                            {item.status === 'Normalt Co2 Nivå' && (
                                                <span className="text-green-600 font-medium">{item.status}</span>
                                            )}
                                            {item.status === 'Feil med sensor' && (
                                                <span className="text-yellow-600 font-medium">{item.status}</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-6">
                    {cardLoading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                Laster romdetaljer...
                            </p>
                            <div className="mt-4 text-6xl opacity-20">🏢</div>
                        </div>
                    ) : cardError ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 text-lg">{cardError}</p>
                        </div>
                    ) : selectedCard ? (
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