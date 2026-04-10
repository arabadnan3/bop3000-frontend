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
                console.log("Rooms from API:", data);
                console.log("Room IDs:", data.map(r => r.id));
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
        try {
            setCardLoading(true);
            setCardError('');

            const roomDetails = await api.getRoomDetails(roomId);
            setSelectedCard(roomDetails);
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
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen">
            <div>
                
                <Navbar />
            </div>

            <div className="flex gap-6 px-8 py-4">
                <div className="w-105 p-4">
                    <div className="mb-8 p-6 border border-slate-700 rounded-xl bg-slate-800 shadow-2xl">
                        <h3 className="font-bold text-xl mb-4 text-white border-b border-slate-700 pb-2">
                            Velg Bygg
                        </h3>
                        <select
                            value={selectedBuilding}
                            onChange={(e) => {
                                setSelectedBuilding(e.target.value);
                            }}
                            className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
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
                        <div className="p-6 border border-slate-700 rounded-xl bg-slate-800 shadow-2xl">
                            <h3 className="font-bold text-xl mb-4 text-white border-b border-slate-700 pb-2">
                                {selectedBuildingData?.name} - Rom
                            </h3>

                            <div className="space-y-3">
                                {roomsLoading && (
                                    <p className="text-slate-400">Laster rom...</p>
                                )}

                                {roomsError && (
                                    <p className="text-red-400">{roomsError}</p>
                                )}

                                {!roomsLoading && !roomsError && rooms.length === 0 && (
                                    <p className="text-slate-400">Ingen rom funnet for dette bygget.</p>
                                )}

                                {!roomsLoading && !roomsError && rooms.map((item, index) => (
                                    <button
                                        key={`${item.id}-${index}`} // Use index as fallback if id is not unique
                                        onClick={() => handleRoomClick(item.id)}
                                        className={`w-full text-left p-4 rounded-lg border transition duration-200 ${
                                            selectedCard?.roomId === item.id
                                                ? 'bg-blue-600 border-blue-500 text-white'
                                                : 'bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600'
                                        }`}
                                    >
                                        <div className="font-semibold">
                                            Rom {item.roomCode}
                                        </div>

                                        <div className="text-sm text-slate-300">
                                            Etg. {item.roomFloor}
                                        </div>

                                        <div className="text-sm mt-1">
                                            {item.status === 'Farlig Co2 Nivå!' && (
                                                <span className="text-red-400 font-medium">{item.status}</span>
                                            )}
                                            {item.status === 'Normalt Co2 Nivå' && (
                                                <span className="text-green-400 font-medium">{item.status}</span>
                                            )}
                                            {item.status === 'Feil med sensor' && (
                                                <span className="text-yellow-400 font-medium">{item.status}</span>
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
                            <p className="text-slate-400 text-lg">
                                Laster romdetaljer...
                            </p>
                            <div className="mt-4 text-6xl opacity-20">🏢</div>
                        </div>
                    ) : cardError ? (
                        <div className="text-center py-12">
                            <p className="text-red-400 text-lg">{cardError}</p>
                        </div>
                    ) : selectedCard ? (
                        <CardDetail data={selectedCard} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-400 text-lg">
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