import React , {useState} from 'react'
import { api } from "../services/api";
import Navbar from './Navbar';


function Settings({buildingData, mockData }) {
    const [activeTab, setActiveTab] = useState("");
    const[selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isBuildingEditing, setIsBuildingEditing] = useState(false);
    const [sensorMode, setSensorMode] = useState(null);

    const [newBuilding, setNewBuilding] = useState({
        name: "",
        streetName: "",
        streetNumber: "",
        zipCode: "",
        city: "",
        floorCount: 1,
        roomCount: 1,
        roomSize: 1
    });

    const handleBuildingChange = (e) => {
        const { name, value, type } = e.target;

        setNewBuilding((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));
    };

    const handleCreateBuilding = async (e) => {
        e.preventDefault();

        try {
            const createdBuilding = await api.createBuilding(newBuilding);
            console.log("Bygning opprettet:", createdBuilding);

            alert("Bygning lagt til!");

            setNewBuilding({
                name: "",
                streetName: "",
                streetNumber: "",
                zipCode: "",
                city: "",
                floorCount: 1,
                roomCount: 1,
                roomSize: 1
            });

            setSelectedBuilding(null);
        } catch (error) {
            console.error("Feil ved opprettelse av bygning:", error);
            alert("Kunne ikke opprette bygning");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="bg-white px-6 pt-6">

                {/* Top Bar under Navbar*/}

                <div className="flex items-center gap-6 border-b border-gray-300 pb-2">
                    <p className="text-lg font-bold underline whitespace-nowrap">Kontroll panel</p>

                    <button onClick={() => {setActiveTab("bygning"); setSelectedBuilding(null); setSelectedSensor(null); }}
                            className={`pb-1 font-semibold cursor-pointer ${
                                activeTab === "bygning" ? "border-b-2 border-black text-black" : "text-gray-500"
                            }`}
                    >
                        Bygning
                    </button>

                    <button onClick={() => {setActiveTab("sensorer"); setSelectedBuilding(null); setSelectedSensor(null); }}
                            className={`pb-1 font-semibold cursor-pointer ${
                                activeTab === "sensorer" ? "border-b-2 border-black text-black" : "text-gray-500"
                            }`}
                    >
                        Sensor
                    </button>

                    {activeTab === "sensorer" && (
                        <button
                            onClick={() => setSelectedSensor("ny")}
                            className="ml-auto py-2 px-5 bg-gray-300 font-bold text-base rounded cursor-pointer hover:bg-gray-400"
                        >
                            + Legg til sensor
                        </button>
                    )}
                </div>

                {/* ── Bygning tab ── */}
                {activeTab === "bygning" && (
                    <div className="flex gap-4 mt-4">

                        {/*Left side*/}
                        <div className="w-72 shrink-0 flex flex-col gap-2">
                            <button
                                onClick={() => setSelectedBuilding("ny")}
                                className="w-full py-2 bg-gray-300 font-bold rounded cursor-pointer hover:bg-gray-400"
                            >
                                + Legg til bygning
                            </button>

                            <div className="overflow-y-auto max-h-[70vh] flex flex-col gap-2 mt-1 ">
                                {buildingData.map(building => (
                                    <div
                                        key={building.id}
                                        onClick={() => {setSelectedBuilding(building); setIsBuildingEditing(false); }}
                                        className={`border rounded p-3 cursor-pointer ${
                                            selectedBuilding?.id === building.id
                                                ? "bg-gray-300 border black"
                                                : "bg-gray-200 border-gray-300"
                                        }`}
                                    >
                                        <p className="text-base font-semibold ">{building.name}</p>
                                        <p className="text-sm text-gray-500 ">{building.address}</p>
                                        <p className="text-sm text-gray-500">{building.postnummer} {building.poststed}</p>
                                    </div>

                                ))}
                            </div>

                        </div>

                        {/*Right side*/}

                        <div className="flex-1 border border-gray-300 rounded bg-gray-50 p-4 min-h-[60vh] ">

                            {/* Empty state */}
                            {!selectedBuilding && (
                                <p className="text-gray-400 text-center mt-20">
                                    Velg en bygning for å se detaljer, eller klikk «Legg til bygning»
                                </p>
                            )}

                            {/*Building form*/}
                            {selectedBuilding === "ny" && (
                                <form onSubmit={handleCreateBuilding}>
                                    <div className="flex flex-col gap-4">
                                        <p className="text-lg font-bold"> Legg til bygning </p>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Bygning navn:</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={newBuilding.name}
                                                onChange={handleBuildingChange}
                                                placeholder="Hovedbygg A"
                                                className="p-2 border rounded bg-white w-64"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Adresse navn:</label>
                                            <input
                                                type="text"
                                                name="streetName"
                                                value={newBuilding.streetName}
                                                onChange={handleBuildingChange}
                                                placeholder="Byggveien"
                                                className="p-2 border rounded bg-white w-64" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Adresse nummer:</label>
                                            <input type="number"
                                                   name="streetNumber"
                                                   value={newBuilding.streetNumber}
                                                   onChange={handleBuildingChange}
                                                   placeholder="28"
                                                   min={1}
                                                   className="p-2 border rounded bg-white w-64" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Postnr:</label>
                                            <input type="text"
                                                   name="zipCode"
                                                   value={newBuilding.zipCode}
                                                   onChange={handleBuildingChange}
                                                   placeholder="0965"
                                                   className="p-2 border rounded bg-white w-64" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Poststed:</label>
                                            <input type="text"
                                                   name="city"
                                                   value={newBuilding.city}
                                                   onChange={handleBuildingChange}
                                                   placeholder="Oslo"
                                                   className="p-2 border rounded bg-white w-64" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Antall etasjer:</label>
                                            <input type="number"
                                                   name="floorCount"
                                                   value={newBuilding.floorCount}
                                                   onChange={handleBuildingChange}
                                                   placeholder="3"
                                                   min={1}
                                                   max={20}
                                                   className="p-2 border rounded bg-white w-64" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Rom pr etasje:</label>
                                            <input type="number"
                                                   name="roomCount"
                                                   value={newBuilding.roomCount}
                                                   onChange={handleBuildingChange}
                                                   placeholder="3"
                                                   min={1}
                                                   max={20}
                                                   className="p-2 border rounded bg-white w-64" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Rom størrelse:</label>
                                            <input type="number"
                                                   name="roomSize"
                                                   value={newBuilding.roomSize}
                                                   onChange={handleBuildingChange}
                                                   placeholder="40"
                                                   min={1}
                                                   max={200}
                                                   className="p-2 border rounded bg-white w-64" />
                                        </div>

                                    </div>

                                    <button type="submit" className="mt-20 py-2 px-4 bg-gray-400 font-bold rounded cursor-pointer hover:bg-gray-500">
                                        Legg til
                                    </button>
                                </form>


                            )}

                            {/* Room Form */}

                            {selectedBuilding === "ny-rom" && (
                                <form onSubmit={(e) => {
                                    e.preventDefault();

                                }}>

                                    <div className="flex flex-col gap-4">
                                        <p className="text-lg font-bold">Legg til rom</p>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Bygning:</label>
                                            <select className="p-2 border rounded bg-white w-64 cursor-pointer" required>
                                                <option value="">Velg bygning</option>
                                                {buildingData.map(b => (
                                                    <option key={b.id} value={b.id}>{b.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Rom kode:</label>
                                            <input type="number" placeholder="F.eks. 101" className="p-2 border rounded bg-white w-64" required />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Etasje:</label>
                                            <input type="number" placeholder="F.eks. 1" className="p-2 border rounded bg-white w-64" required />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Areal (m²):</label>
                                            <input type="number" placeholder="F.eks. 25" className="p-2 border rounded bg-white w-64" required />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-36" />
                                            <button type="submit" className="py-2 px-4 bg-gray-400 font-bold rounded cursor-pointer hover:bg-gray-500">
                                                Legg til
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* SelectedBuilding details */}

                            {selectedBuilding && selectedBuilding !== "ny" && selectedBuilding !== "ny-rom" && (
                                <div key={selectedBuilding.id} className="flex flex-col gap-4">
                                    <p className="text-lg font-bold">{selectedBuilding.name}</p>

                                    {[
                                        { label: "Adresse", value: selectedBuilding.address },
                                        { label: "Postnummer", value: selectedBuilding.postnummer },
                                        { label: "Poststed", value: selectedBuilding.poststed },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">{label}:</label>
                                            <input
                                                type="text"
                                                defaultValue={value}
                                                readOnly={!isBuildingEditing}
                                                className={`p-2 border rounded w-64 ${
                                                    isBuildingEditing ? "bg-white border-black" : "bg-gray-100"
                                                }`}
                                            />
                                        </div>
                                    ))}

                                    <div className="flex flex-col gap-2 mt-2">
                                        <button
                                            onClick={() => setIsBuildingEditing(prev => !prev)}
                                            className={`w-64 py-2 px-4 font-semibold rounded cursor-pointer border text-left ${
                                                isBuildingEditing
                                                    ? "bg-black text-white border-black hover:bg-gray-800"
                                                    : "bg-gray-200 border-gray-400 hover:bg-gray-300"
                                            }`}
                                        >
                                            {isBuildingEditing ? "Lagre endringer" : "Endre bygninginformasjon"}
                                        </button>

                                        {isBuildingEditing && (
                                            <button
                                                onClick={() => setIsBuildingEditing(false)}
                                                className="w-64 py-2 px-4 bg-gray-100 border border-gray-300 font-semibold rounded cursor-pointer hover:bg-gray-200 text-left"
                                            >
                                                Avbryt
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setSelectedBuilding("ny-rom")}
                                            className="w-64 py-2 px-4 bg-gray-200 border border-gray-400 font-semibold rounded cursor-pointer hover:bg-gray-300 text-left"
                                        >
                                            Legg til rom
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/*Sensor */}

                {activeTab === "sensorer" && (
                    <div className="flex gap-4 mt-4">

                        {/* Left side */}
                        <div className="w-72 shrink-0 flex flex-col gap-2">

                            {/* Building dropdown filter */}
                            <div className="border border-gray-400 rounded bg-gray-100 p-2">
                                <label className="text-xs text-gray-500 font-semibold">Bygg</label>
                                <select
                                    className="w-full bg-transparent font-semibold mt-1 cursor-pointer outline-none"
                                    onChange={e => {
                                        setSelectedBuilding(buildingData.find(b => b.id === Number(e.target.value)) || null);
                                        setSelectedSensor(null);
                                    }}
                                    value={selectedBuilding?.id || ""}
                                >
                                    <option value="">Alle bygninger</option>
                                    {buildingData.map(b => (
                                        <option key={b.id} value={b.id}>{b.name} — {b.address}</option>
                                    ))}
                                </select>
                            </div>

                            {/*list*/}

                            <div className="overflow-y-auto max-h-[65vh] flex flex-col gap-2 mt-1">
                                {mockData
                                    .filter(s => selectedBuilding ? s.building.startsWith(selectedBuilding.name) : true)
                                    .map(sensor => (
                                        <div
                                            key={sensor.sensorId}
                                            onClick={() => { setSelectedSensor(sensor); setIsEditing(false); }}
                                            className={`border rounded p-3 cursor-pointer flex justify-between items-center ${
                                                selectedSensor?.sensorId === sensor.sensorId
                                                    ? "bg-gray-400 border-black"
                                                    : "bg-gray-200 border-gray-300"
                                            }`}
                                        >
                                            <div>
                                                <p className="font-bold text-sm">SN-C02-{sensor.sensorId}</p>
                                                <p className="text-xs text-gray-600">{sensor.building} | {sensor.room}</p>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full ${
                                                sensor.status === "Normalt Co2 Nivå" ? "bg-green-500" : "bg-red-500"
                                            }`} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex-1 border border-gray-300 rounded bg-gray-50 p-4 min-h-[60vh]">

                            {/* Empty state */}
                            {!selectedSensor && (
                                <p className="text-gray-400 text-center mt-20">
                                    Velg en sensor for å se detaljer, eller klikk «Legg til sensor» for å opprette en ny
                                </p>
                            )}

                            {/*Selected sensor details*/}

                            {selectedSensor && selectedSensor !== "ny" && (
                                <div key={selectedSensor.sensorId} className="flex flex-col gap-4 mt-6 px-4">
                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Sensor serienr:</label>
                                        <input
                                            type="text"
                                            defaultValue={`SN-C02-${selectedSensor.sensorId}`}
                                            readOnly={!isEditing}
                                            className={`p-2 border rounded w-64 ${
                                                isEditing ? "bg-white border-black" : "bg-gray-100"
                                            }`}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Sensor type:</label>
                                        {isEditing ? (
                                            <select className="p-2 border border-black rounded bg-white w-64 cursor-pointer">
                                                <option value="CO2">CO2</option>
                                                <option value="Temperatur">Temperatur</option>
                                                <option value="Luftfuktighet">Luftfuktighet</option>
                                                <option value="Bevegelse">Bevegelse</option>
                                            </select>
                                        ) : (
                                            <input type="text" defaultValue="CO2" readOnly className="p-2 border rounded w-64 bg-gray-100" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Adresse:</label>
                                        {isEditing ? (
                                            <select className="p-2 border border-black rounded bg-white w-64 cursor-pointer">
                                                <option value={selectedSensor.building}>{selectedSensor.building}</option>
                                                {[...new Set(mockData.map(s => s.building))]
                                                    .filter(b => b !== selectedSensor.building)
                                                    .map(b => <option key={b} value={b}>{b}</option>)
                                                }
                                            </select>
                                        ) : (
                                            <input type="text" defaultValue={selectedSensor.building} readOnly className="p-2 border rounded w-64 bg-gray-100" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Etasje:</label>
                                        {isEditing ? (
                                            <select className="p-2 border border-black rounded bg-white w-64 cursor-pointer">
                                                <option value={selectedSensor.floor}>{selectedSensor.floor}</option>
                                                {[...new Set(mockData.map(s => s.floor))]
                                                    .filter(f => f !== selectedSensor.floor)
                                                    .map(f => <option key={f} value={f}>{f}</option>)
                                                }
                                            </select>
                                        ) : (
                                            <input type="text" defaultValue={selectedSensor.floor} readOnly className="p-2 border rounded w-64 bg-gray-100" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Romnr:</label>
                                        {isEditing ? (
                                            <select className="p-2 border border-black rounded bg-white w-64 cursor-pointer">
                                                <option value={selectedSensor.room}>{selectedSensor.room}</option>
                                                {[...new Set(mockData.map(s => s.room))]
                                                    .filter(r => r !== selectedSensor.room)
                                                    .map(r => <option key={r} value={r}>{r}</option>)
                                                }
                                            </select>
                                        ) : (
                                            <input type="text" defaultValue={selectedSensor.room} readOnly className="p-2 border rounded w-64 bg-gray-100" />
                                        )}
                                    </div>

                                    {/*sensor rules*/}

                                    <div className="flex items-start gap-2">
                                        <label className="w-40 text-right font-bold text-sm pt-2">Sensor regel:</label>
                                        <div className="flex flex-col gap-3">
                                            {[1, 2].map(i => (
                                                <div
                                                    key={i}
                                                    className={`flex flex-col gap-1 p-3 border rounded w-72 ${
                                                        isEditing ? "bg-white border-black" : "bg-gray-50"
                                                    }`}
                                                >
                                                    <p className="text-xs text-gray-400 font-semibold mb-1">Regel {i}</p>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose threshold:</label>
                                                        <input
                                                            type="number"
                                                            defaultValue={i === 1 ? 800 : 600}
                                                            readOnly={!isEditing}
                                                            className={`p-1 border rounded w-24 text-sm ${
                                                                isEditing ? "bg-white" : "bg-gray-100"
                                                            }`}
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose rule operator:</label>
                                                        {isEditing ? (
                                                            <select className="p-1 border border-black rounded bg-white w-24 text-sm cursor-pointer">
                                                                <option value="GREATER_OR_EQUAL">&gt;=</option>
                                                                <option value="GREATER_THAN">&gt;</option>
                                                                <option value="LESS_THAN">&lt;</option>
                                                                <option value="EQUALS">=</option>
                                                                <option value="LESS_OR_EQUAL">&lt;=</option>
                                                            </select>
                                                        ) : (
                                                            <input type="text" readOnly value=">=" className="p-1 border rounded w-24 text-sm bg-gray-100" />
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose severity:</label>
                                                        {isEditing ? (
                                                            <select className="p-1 border border-black rounded bg-white w-24 text-sm cursor-pointer">
                                                                <option value="CRITICAL">CRITICAL</option>
                                                                <option value="WARNING">WARNING</option>
                                                            </select>
                                                        ) : (
                                                            <input type="text" readOnly value={i === 1 ? "CRITICAL" : "WARNING"} className="p-1 border rounded w-24 text-sm bg-gray-100" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Buttons*/}

                                    <div className="flex flex-col gap-2 mt-6">
                                        <button
                                            onClick={() => setSensorMode(selectedSensor)}
                                            className="w-64 py-2 px-4 bg-gray-200 border border-gray-400 font-semibold rounded cursor-pointer hover:bg-gray-300 text-left"
                                        >
                                            Slå av/på sensor
                                        </button>

                                        <button
                                            onClick={() => setIsEditing(prev => !prev)}
                                            className={`w-64 py-2 px-4 font-semibold rounded cursor-pointer border text-left ${
                                                isEditing
                                                    ? "bg-black text-white border-black hover:bg-gray-800"
                                                    : "bg-gray-200 border-gray-400 hover:bg-gray-300"
                                            }`}
                                        >
                                            {isEditing ? "Lagre endringer" : "Endre sensorinformasjon"}
                                        </button>

                                        {isEditing && (
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="w-64 py-2 px-4 bg-gray-100 border border-gray-300 font-semibold rounded cursor-pointer hover:bg-gray-200 text-left"
                                            >
                                                Avbryt
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* add sensor form*/}

                            {selectedSensor === "ny" && (
                                <div className="flex flex-col gap-4 mt-6 px-4">
                                    <p className="text-lg font-bold">Legg til sensor</p>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Sensor serienr:</label>
                                        <input type="text" placeholder="Sensor serienr" className="p-2 border rounded bg-white w-64" />
                                    </div>

                                    {/* Sensor type dropdown */}
                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Sensor type:</label>
                                        <select className="p-2 border rounded bg-white w-64 cursor-pointer">
                                            <option value="">Velg type</option>
                                            <option value="CO2">CO2</option>
                                            <option value="Temperatur">Temperatur</option>
                                            <option value="Luftfuktighet">Luftfuktighet</option>
                                            <option value="Bevegelse">Bevegelse</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Adresse:</label>
                                        <select className="p-2 border rounded bg-white w-64 cursor-pointer">
                                            <option value="">Velg adresse</option>
                                            {[...new Set(mockData.map(s => s.building))].map(b => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Etasje:</label>
                                        <select className="p-2 border rounded bg-white w-64 cursor-pointer">
                                            <option value="">Velg etasje</option>
                                            {[...new Set(mockData.map(s => s.floor))].map(f => (
                                                <option key={f} value={f}>{f}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Romnr:</label>
                                        <select className="p-2 border rounded bg-white w-64 cursor-pointer">
                                            <option value="">Velg rom</option>
                                            {[...new Set(mockData.map(s => s.room))].map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sensor rules*/}

                                    <div className="flex items-start gap-2">
                                        <label className="w-40 text-right font-bold text-sm pt-2">Sensor regel:</label>
                                        <div className="flex flex-col gap-4">
                                            {[1, 2].map(i => (
                                                <div key={i} className="flex flex-col gap-1 p-3 border rounded bg-gray-50 w-72">
                                                    <p className="text-xs text-gray-400 font-semibold mb-1">Regel {i}</p>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose threshold:</label>
                                                        <input type="number" placeholder="F.eks. 800" className="p-1 border rounded bg-white w-24 text-sm" />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose rule operator:</label>
                                                        <select className="p-1 border rounded bg-white w-24 text-sm cursor-pointer">
                                                            <option value="">Velg</option>
                                                            <option value="GREATER_THAN">&gt;</option>
                                                            <option value="LESS_THAN">&lt;</option>
                                                            <option value="EQUALS">=</option>
                                                            <option value="GREATER_OR_EQUAL">&gt;=</option>
                                                            <option value="LESS_OR_EQUAL">&lt;=</option>
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose severity:</label>
                                                        <select className="p-1 border rounded bg-white w-24 text-sm cursor-pointer">
                                                            <option value="">Velg</option>
                                                            <option value="WARNING">WARNING</option>
                                                            <option value="CRITICAL">CRITICAL</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-40" />
                                        <button className="py-2 px-4 bg-gray-400 font-bold rounded cursor-pointer hover:bg-gray-500">
                                            Legg til
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Sensor button for On/Off */}

            {sensorMode && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 shadow-xl flex flex-col gap-4">
                        <p className="text-lg font-bold">Slå av/på sensor</p>
                        <p className="text-sm text-gray-600">
                            Sensor: <span className="font-semibold">SN-C02-{sensorMode.sensorId}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            Rom: <span className="font-semibold">{sensorMode.room} - {sensorMode.floor}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            Nåværende status:{" "}
                            <span className={`font-bold ${
                                sensorMode.status === "Normalt Co2 Nivå" ? "text-green-600" : "text-red-600"
                            }`}>
                                {sensorMode.status === "Normalt Co2 Nivå" ? "Aktiv" : "Inaktiv / Feil"}
                            </span>
                        </p>

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => setSensorMode(null)}
                                className="flex-1 py-2 bg-gray-200 border border-gray-300 font-semibold rounded cursor-pointer hover:bg-gray-300"
                            >
                                Avbryt
                            </button>
                            <button
                                onClick={() => {
                                    alert(`Sensor SN-C02-${sensorMode.sensorId} har blitt ${
                                        sensorMode.status === "Normalt Co2 Nivå" ? "deaktivert" : "aktivert"
                                    }`);
                                    setSensorMode(null);
                                }}
                                className="flex-1 py-2 bg-black text-white font-semibold rounded cursor-pointer hover:bg-gray-800"
                            >
                                {sensorMode.status === "Normalt Co2 Nivå" ? "Slå av" : "Slå på"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Settings;