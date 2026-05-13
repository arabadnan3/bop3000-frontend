import React, {useEffect, useState} from 'react'
import {api} from "../services/api";
import Navbar from './Navbar';


function Settings() {
    const [activeTab, setActiveTab] = useState("bygning");
    const [buildingLoading, setBuildingLoading] = useState(false);
    const [sensorLoading, setSensorLoading] = useState(false);
    const [buildingError, setBuildingError] = useState("");
    const [sensorError, setSensorError] = useState("");
    const [buildings, setBuildings] = useState([]);
    const [sensors, setSensors] = useState([]);
    //const [error, setError] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isBuildingEditing, setIsBuildingEditing] = useState(false);
    const [sensorMode, setSensorMode] = useState(null);
    const [selectedSensorBuildingId, setSelectedSensorBuildingId] = useState("");
    const [selectedSensorFloor, setSelectedSensorFloor] = useState("");
    const [roomsForSelectedBuilding, setRoomsForSelectedBuilding] = useState([]);

    const fetchBuildings = async () => {
        try {
            setBuildingLoading(true);
            setBuildingError("");

            const data = await api.getBuildings();

            const mappedBuildings = data
                .map((building) => ({
                    id: building.id,
                    name: building.name,
                    streetName: building.streetName,
                    streetNumber: building.streetNumber,
                    zipCode: building.zipCode,
                    city: building.city
                }))
                .sort((a, b) => a.id - b.id);

            setBuildings(mappedBuildings);
        } catch (err) {
            setBuildingError("Failed to load buildings");
            console.error(err);
        } finally {
            setBuildingLoading(false);
        }
    };

    const fetchSensors = async (buildingId = null) => {
        try {
            setSensorLoading(true);
            setSensorError("");

            const data = buildingId
                ? await api.getSensorDetailsByBuilding(buildingId)
                : await api.getSensorsAndDetails();

            const mappedSensors = data.map((sensor) => ({
                id: sensor.id,
                roomId: sensor.roomId,
                roomCode: sensor.roomCode,
                roomFloor: sensor.roomFloor,
                buildingName: sensor.buildingName,
                address: `${sensor.streetName} ${sensor.streetNumber}`,
                sensorSerial: sensor.sensorSerial,
                sensorType: sensor.sensorType,
                sensorBattery: sensor.sensorBattery,
                sensorStatus: sensor.sensorStatus,
                sensorRules: sensor.sensorRules
            }));

            setSensors(mappedSensors);
            console.log(mappedSensors);
        } catch (err) {
            setSensorError("Failed to load sensors");
            console.error(err);
            setSensors([]);
        } finally {
            setSensorLoading(false);
        }
    };

    const fetchRoomsForBuilding = async (buildingId) => {
        try {
            const data = await api.getRoomsFromBuilding(buildingId);

            const mappedRooms = data.map((room) => ({
                id: room.id,
                roomCode: room.roomCode,
                floor: room.roomFloor
            }));

            setRoomsForSelectedBuilding(mappedRooms);
        } catch (err) {
            console.error("Failed to load rooms for building", err);
            setRoomsForSelectedBuilding([]);
        }
    };

    useEffect(() => {
        fetchBuildings();
        fetchSensors();
    }, []);

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

    const [newSensor, setNewSensor] = useState({
        sensorSerial: "",
        sensorType: "",
        roomId: "",
        sensorRules: [
            {
                ruleOperator: "GREATER_THAN",
                ruleThreshold: 0,
                ruleSeverity: "WARNING",
                active: true
            },
            {
                ruleOperator: "GREATER_THAN",
                ruleThreshold: 0,
                ruleSeverity: "CRITICAL",
                active: true
            }
        ]
    });

    const RULE_OPERATOR_LABELS = {
        GREATER_THAN: ">",
        LESS_THAN: "<",
        EQUALS: "=",
        GREATER_OR_EQUAL: ">=",
        LESS_OR_EQUAL: "<="
    };

    const handleSensorChange = (e) => {
        const { name, value } = e.target;
        setNewSensor((prev) => ({
            ...prev,
            [name]: name === "roomId" ? Number(value) : value
        }));
    };

    const handleRuleChange = (index, field, value) => {
        setNewSensor((prev) => ({
            ...prev,
            sensorRules: prev.sensorRules.map((rule, i) =>
                i === index
                    ? {
                        ...rule,
                        [field]: field === "ruleThreshold" ? Number(value) : value
                    }
                    : rule
            )
        }));
    };

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

            await fetchBuildings();

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

    const handleUpdateBuilding = async () => {
        try {
            await api.updateBuilding(selectedBuilding);

            await fetchBuildings();

            setIsBuildingEditing(false);

            alert("Bygning oppdatert!");
        } catch (error) {
            console.error("Feil ved oppdatering av bygning:", error);
            alert("Kunne ikke oppdatere bygning");
        }
    };

    const handleUpdateSensor = async () => {
        try {
            await api.updateSensor(selectedSensor);

            await fetchSensors(selectedBuilding?.id || null);

            setIsEditing(false);

            alert("Sensor oppdatert!");
        } catch (error) {
            console.error("Feil ved oppdatering av sensor:", error);
            alert("Kunne ikke oppdatere sensor");
        }
    };

    const handleSelectedSensorRuleChange = (index, field, value) => {
        setSelectedSensor(prev => ({
            ...prev,
            sensorRules: prev.sensorRules.map((rule, i) =>
                i === index
                    ? {
                        ...rule,
                        [field]: field === "ruleThreshold" ? Number(value) : value
                    }
                    : rule
            )
        }));
    };

    const handleCreateSensor = async (e) => {
        e.preventDefault();

        try {
            await api.createSensor(newSensor);

            alert("Sensor lagt til!");

            setNewSensor({
                sensorSerial: "",
                sensorType: "",
                roomId: "",
                sensorRules: [
                    {
                        ruleOperator: "GREATER_THAN",
                        ruleThreshold: 0,
                        ruleSeverity: "WARNING",
                        active: true
                    },
                    {
                        ruleOperator: "GREATER_THAN",
                        ruleThreshold: 0,
                        ruleSeverity: "CRITICAL",
                        active: true
                    }
                ]
            });

            setSelectedSensorBuildingId("");
            setSelectedSensorFloor("");
            setRoomsForSelectedBuilding([]);
            setSelectedSensor(null);

            await fetchSensors(selectedBuilding?.id || null);
        } catch (error) {
            console.error("Feil ved opprettelse av sensor:", error);
            alert("Kunne ikke opprette sensor");
        }
    };

    const availableFloors = [...new Set(roomsForSelectedBuilding.map(room => room.floor))].sort((a, b) => a - b);

    const filteredRooms = roomsForSelectedBuilding.filter(
        (room) => String(room.floor) === String(selectedSensorFloor)
    );

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

                            {buildingLoading && <p className="text-sm text-gray-500">Laster bygninger...</p>}
                            {buildingError && <p className="text-sm text-red-500">{buildingError}</p>}

                            {!buildingLoading && !buildingError && buildings.length === 0 && (
                                <p className="text-sm text-gray-500">Ingen bygninger funnet.</p>
                            )}

                            <div className="overflow-y-auto max-h-[70vh] flex flex-col gap-2 mt-1 ">
                                {!buildingLoading && buildings.map(building => (
                                    <div
                                        key={building.id}
                                        onClick={() => {
                                            setSelectedBuilding(building);
                                            setIsBuildingEditing(false);
                                        }}
                                        className={`border rounded p-3 cursor-pointer ${
                                            selectedBuilding?.id === building.id
                                                ? "bg-gray-300 border-black"
                                                : "bg-gray-200 border-gray-300"
                                        }`}
                                    >
                                        <p className="text-base font-semibold">{building.name}</p>
                                        <p className="text-sm text-gray-500">{building.streetName} {building.streetNumber}</p>
                                        <p className="text-sm text-gray-500">{building.zipCode} {building.city}</p>
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
                                            <input type="text"
                                                   name="streetNumber"
                                                   value={newBuilding.streetNumber}
                                                   onChange={handleBuildingChange}
                                                   placeholder="28"
                                                   className="p-2 border rounded bg-white w-20" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Postnr:</label>
                                            <input type="text"
                                                   name="zipCode"
                                                   value={newBuilding.zipCode}
                                                   onChange={handleBuildingChange}
                                                   placeholder="0965"
                                                   className="p-2 border rounded bg-white w-30" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="w-36 text-right font-bold">Poststed:</label>
                                            <input type="text"
                                                   name="city"
                                                   value={newBuilding.city}
                                                   onChange={handleBuildingChange}
                                                   placeholder="Oslo"
                                                   className="p-2 border rounded bg-white w-40" />
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
                                                   className="p-2 border rounded bg-white w-20" />
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
                                                   className="p-2 border rounded bg-white w-20" />
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
                                                   className="p-2 border rounded bg-white w-30" />
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
                                                {buildings.map(b => (
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

                            {/* =========================
                              BUILDING DETAILS SECTION
                             ========================= */}

                            {selectedBuilding && selectedBuilding !== "ny" && selectedBuilding !== "ny-rom" && (
                                <div key={selectedBuilding.id} className="flex flex-col gap-4">
                                    <p className="text-lg font-bold">{selectedBuilding.name}</p>

                                    <div className="flex items-center gap-2">
                                        <label className="w-36 text-right font-bold">Bygning navn:</label>
                                        <input
                                            type="text"
                                            value={selectedBuilding.name}
                                            readOnly={!isBuildingEditing}
                                            onChange={(e) =>
                                                setSelectedBuilding(prev => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))
                                            }
                                            className={`p-2 border rounded w-64 ${
                                                isBuildingEditing ? "bg-white border-black" : "bg-gray-100"
                                            }`}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-36 text-right font-bold">Adresse:</label>

                                        <input
                                            type="text"
                                            value={selectedBuilding.streetName}
                                            readOnly={!isBuildingEditing}
                                            onChange={(e) =>
                                                setSelectedBuilding(prev => ({
                                                    ...prev,
                                                    streetName: e.target.value
                                                }))
                                            }
                                            className={`p-2 border rounded w-44 ${
                                                isBuildingEditing ? "bg-white border-black" : "bg-gray-100"
                                            }`}
                                        />

                                        <input
                                            type="text"
                                            value={selectedBuilding.streetNumber}
                                            readOnly={!isBuildingEditing}
                                            onChange={(e) =>
                                                setSelectedBuilding(prev => ({
                                                    ...prev,
                                                    streetNumber: e.target.value
                                                }))
                                            }
                                            className={`p-2 border rounded w-18 ${
                                                isBuildingEditing ? "bg-white border-black" : "bg-gray-100"
                                            }`}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-36 text-right font-bold">Postnummer:</label>
                                        <input
                                            type="text"
                                            value={selectedBuilding.zipCode}
                                            readOnly={!isBuildingEditing}
                                            onChange={(e) =>
                                                setSelectedBuilding(prev => ({
                                                    ...prev,
                                                    zipCode: e.target.value
                                                }))
                                            }
                                            className={`p-2 border rounded w-20 ${
                                                isBuildingEditing ? "bg-white border-black" : "bg-gray-100"
                                            }`}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-36 text-right font-bold">Poststed:</label>
                                        <input
                                            type="text"
                                            value={selectedBuilding.city}
                                            readOnly={!isBuildingEditing}
                                            onChange={(e) =>
                                                setSelectedBuilding(prev => ({
                                                    ...prev,
                                                    city: e.target.value
                                                }))
                                            }
                                            className={`p-2 border rounded w-44 ${
                                                isBuildingEditing ? "bg-white border-black" : "bg-gray-100"
                                            }`}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 mt-2">
                                        <button
                                            onClick={() => {
                                                if (isBuildingEditing) {
                                                    handleUpdateBuilding();
                                                } else {
                                                    setIsBuildingEditing(true);
                                                }
                                            }}
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

                            <button
                                onClick={() => setSelectedSensor("ny")}
                                className="w-full py-2 bg-gray-300 font-bold rounded cursor-pointer hover:bg-gray-400"
                            >
                                + Legg til sensor
                            </button>

                            {/* Building dropdown filter */}
                            <div className="border border-gray-400 rounded bg-gray-100 p-2">
                                <label className="text-xs text-gray-500 font-semibold">Bygg</label>
                                <select
                                    className="w-full bg-transparent font-semibold mt-1 cursor-pointer outline-none"
                                    onChange={async (e) => {
                                        const buildingId = e.target.value;

                                        if (!buildingId) {
                                            setSelectedBuilding(null);
                                            setSelectedSensor(null);
                                            await fetchSensors();
                                            return;
                                        }

                                        const building = buildings.find(b => b.id === Number(buildingId)) || null;
                                        setSelectedBuilding(building);
                                        setSelectedSensor(null);
                                        await fetchSensors(Number(buildingId));
                                    }}
                                    value={selectedBuilding?.id || ""}
                                >
                                    <option value="">Alle bygninger</option>
                                    {buildings.map(b => (
                                        <option key={b.id} value={b.id}>
                                            {b.name} — {b.streetName} {b.streetNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/*list*/}

                            <div className="overflow-y-auto max-h-[65vh] flex flex-col gap-2 mt-1">
                                {sensorLoading && <p className="text-sm text-gray-500">Laster sensorer...</p>}
                                {sensorError && <p className="text-sm text-red-500">{sensorError}</p>}

                                {!sensorLoading && !sensorError && sensors.length === 0 && (
                                    <p className="text-sm text-gray-500">Ingen sensorer funnet.</p>
                                )}

                                {!sensorLoading && sensors.map(sensor => (
                                    <div
                                        key={sensor.id}
                                        onClick={() => {
                                            setSelectedSensor(sensor);
                                            setIsEditing(false);
                                        }}
                                        className={`border rounded p-3 cursor-pointer flex justify-between items-center ${
                                            selectedSensor?.id === sensor.id
                                                ? "bg-gray-400 border-black"
                                                : "bg-gray-200 border-gray-300"
                                        }`}
                                    >
                                        <div>
                                            <p className="font-bold text-sm">{sensor.sensorSerial}</p>
                                            <p className="text-xs text-gray-600">
                                                {sensor.buildingName} ({sensor.address}) | Rom {sensor.roomCode}
                                            </p>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full ${
                                            sensor.sensorStatus ? "bg-green-500" : "bg-red-500"
                                        }`} />
                                    </div>
                                ))}
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

                            {/* =========================
                               SENSOR DETAILS SECTION
                               ========================= */}

                            {selectedSensor && selectedSensor !== "ny" && (
                                <div key={selectedSensor.id} className="flex flex-col gap-4 mt-6 px-4">

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Sensor serienr:</label>
                                        <input
                                            type="text"
                                            value={selectedSensor.sensorSerial}
                                            readOnly={!isEditing}
                                            onChange={(e) =>
                                                setSelectedSensor(prev => ({
                                                    ...prev,
                                                    sensorSerial: e.target.value
                                                }))
                                            }
                                            className={`p-2 border rounded w-40 ${
                                                isEditing ? "bg-white border-black" : "bg-gray-100"
                                            }`}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Sensor type:</label>
                                        {isEditing ? (
                                            <select
                                                value={selectedSensor.sensorType}
                                                onChange={(e) =>
                                                    setSelectedSensor(prev => ({
                                                        ...prev,
                                                        sensorType: e.target.value
                                                    }))
                                                }
                                                className="p-2 border border-black rounded bg-white w-40 cursor-pointer"
                                            >
                                                <option value="CO2">CO2</option>
                                                <option value="TEMPERATUR">Temperatur</option>
                                                <option value="LUFTFUKTIGHET">Luftfuktighet</option>
                                                <option value="BEVEGELSE">Bevegelse</option>
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={selectedSensor.sensorType}
                                                readOnly
                                                className="p-2 border rounded w-64 bg-gray-100"
                                            />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Adresse:</label>
                                        <input
                                            type="text"
                                            value={`${selectedSensor.buildingName} (${selectedSensor.address})`}
                                            readOnly
                                            className="p-2 border rounded w-64 bg-gray-100"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Etasje:</label>
                                        <input
                                            type="text"
                                            value={selectedSensor.roomFloor ?? ""}
                                            readOnly
                                            className="p-2 border rounded w-64 bg-gray-100"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Romnr:</label>
                                        <input
                                            type="text"
                                            value={selectedSensor.roomCode}
                                            readOnly
                                            className="p-2 border rounded w-64 bg-gray-100"
                                        />
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <label className="w-40 text-right font-bold text-sm pt-2">Sensor regel:</label>

                                        <div className="flex flex-col gap-3">
                                            {selectedSensor.sensorRules.map((rule, index) => (
                                                <div
                                                    key={rule.id}
                                                    className={`flex flex-col gap-1 p-3 border rounded w-120 ${
                                                        isEditing ? "bg-white border-black" : "bg-gray-50"
                                                    }`}
                                                >
                                                    <p className="text-xs text-gray-400 font-semibold mb-1">Regel {index + 1}</p>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose threshold:</label>
                                                        <input
                                                            type="number"
                                                            value={rule.ruleThreshold}
                                                            readOnly={!isEditing}
                                                            onChange={(e) =>
                                                                handleSelectedSensorRuleChange(index, "ruleThreshold", e.target.value)
                                                            }
                                                            className={`p-1 border rounded w-15 text-sm ${
                                                                isEditing ? "bg-white" : "bg-gray-100"
                                                            }`}
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose rule operator:</label>
                                                        {isEditing ? (
                                                            <select
                                                                value={rule.ruleOperator}
                                                                onChange={(e) =>
                                                                    handleSelectedSensorRuleChange(index, "ruleOperator", e.target.value)
                                                                }
                                                                className="p-1 border border-black rounded bg-white w-15 text-sm cursor-pointer"
                                                            >
                                                                {Object.entries(RULE_OPERATOR_LABELS).map(([key, label]) => (
                                                                    <option key={key} value={key}>
                                                                        {label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={RULE_OPERATOR_LABELS[rule.ruleOperator]}
                                                                className="p-1 border rounded w-35 text-sm bg-gray-100"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose severity:</label>
                                                        {isEditing ? (
                                                            <select
                                                                value={rule.ruleSeverity}
                                                                onChange={(e) =>
                                                                    handleSelectedSensorRuleChange(index, "ruleSeverity", e.target.value)
                                                                }
                                                                className="p-1 border border-black rounded bg-white w-24 text-sm cursor-pointer"
                                                            >
                                                                <option value="CRITICAL">CRITICAL</option>
                                                                <option value="WARNING">WARNING</option>
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={rule.ruleSeverity}
                                                                className="p-1 border rounded w-19 text-sm bg-gray-100"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 mt-6">
                                        <button
                                            onClick={() => setSensorMode(selectedSensor)}
                                            className="w-64 py-2 px-4 bg-gray-200 border border-gray-400 font-semibold rounded cursor-pointer hover:bg-gray-300 text-left"
                                        >
                                            Slå av/på sensor
                                        </button>

                                        {/* SENSOR EDIT TOGGLE BUTTON
                                           This controls all places using isEditing */}
                                        <button
                                            onClick={() => {
                                                if (isEditing) {
                                                    handleUpdateSensor();
                                                } else {
                                                    setIsEditing(true);
                                                }
                                            }}
                                            className={`w-64 py-2 px-4 font-semibold rounded cursor-pointer border text-left ${
                                                isEditing
                                                    ? "bg-black text-white border-black hover:bg-gray-800"
                                                    : "bg-gray-200 border-gray-400 hover:bg-gray-300"
                                            }`}
                                        >
                                            {isEditing ? "Lagre endringer" : "Endre sensorinformasjon"}
                                        </button>

                                        {/* SENSOR CANCEL BUTTON
                                           Only visible in edit mode */}
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
                                <form onSubmit={handleCreateSensor} className="flex flex-col gap-4 mt-6 px-4">
                                    <p className="text-lg font-bold">Legg til sensor</p>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Sensor serienr:</label>
                                        <input
                                            type="text"
                                            name="sensorSerial"
                                            value={newSensor.sensorSerial}
                                            onChange={handleSensorChange}
                                            placeholder="SN-C02-001"
                                            className="p-2 border rounded bg-white w-64"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Sensor type:</label>
                                        <select
                                            name="sensorType"
                                            value={newSensor.sensorType}
                                            onChange={handleSensorChange}
                                            className="p-2 border rounded bg-white w-64 cursor-pointer"
                                            required
                                        >
                                            <option value="">Velg type</option>
                                            <option value="CO2">CO2</option>
                                            <option value="TEMPERATUR">Temperatur</option>
                                            <option value="LUFTFUKTIGHET">Luftfuktighet</option>
                                            <option value="BEVEGELSE">Bevegelse</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Bygg:</label>
                                        <select
                                            value={selectedSensorBuildingId}
                                            onChange={async (e) => {
                                                const buildingId = e.target.value;
                                                setSelectedSensorBuildingId(buildingId);
                                                setSelectedSensorFloor("");
                                                setRoomsForSelectedBuilding([]);
                                                setNewSensor((prev) => ({ ...prev, roomId: "" }));

                                                if (buildingId) {
                                                    await fetchRoomsForBuilding(Number(buildingId));
                                                }
                                            }}
                                            className="p-2 border rounded bg-white w-64 cursor-pointer"
                                            required
                                        >
                                            <option value="">Velg bygg</option>
                                            {buildings.map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name} — {b.streetName} {b.streetNumber}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Etasje:</label>
                                        <select
                                            value={selectedSensorFloor}
                                            onChange={(e) => {
                                                setSelectedSensorFloor(e.target.value);
                                                setNewSensor((prev) => ({ ...prev, roomId: "" }));
                                            }}
                                            className="p-2 border rounded bg-white w-64 cursor-pointer"
                                            required
                                            disabled={!selectedSensorBuildingId}
                                        >
                                            <option value="">Velg etasje</option>
                                            {availableFloors.map((floor) => (
                                                <option key={floor} value={floor}>
                                                    {floor}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="w-40 text-right font-bold text-sm">Romnr:</label>
                                        <select
                                            name="roomId"
                                            value={newSensor.roomId}
                                            onChange={handleSensorChange}
                                            className="p-2 border rounded bg-white w-64 cursor-pointer"
                                            required
                                            disabled={!selectedSensorFloor}
                                        >
                                            <option value="">Velg rom</option>
                                            {filteredRooms.map((room) => (
                                                <option key={room.id} value={room.id}>
                                                    {room.roomCode}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <label className="w-40 text-right font-bold text-sm pt-2">Sensor regel:</label>
                                        <div className="flex flex-col gap-4">
                                            {newSensor.sensorRules.map((rule, index) => (
                                                <div key={index} className="flex flex-col gap-1 p-3 border rounded bg-gray-50 w-72">
                                                    <p className="text-xs text-gray-400 font-semibold mb-1">Regel {index + 1}</p>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose threshold:</label>
                                                        <input
                                                            type="number"
                                                            value={rule.ruleThreshold}
                                                            onChange={(e) => handleRuleChange(index, "ruleThreshold", e.target.value)}
                                                            className="p-1 border rounded bg-white w-24 text-sm"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose rule operator:</label>
                                                        <select
                                                            value={rule.ruleOperator}
                                                            onChange={(e) => handleRuleChange(index, "ruleOperator", e.target.value)}
                                                            className="p-1 border rounded bg-white w-24 text-sm cursor-pointer"
                                                        >
                                                            <option value="GREATER_THAN">&gt;</option>
                                                            <option value="LESS_THAN">&lt;</option>
                                                            <option value="EQUALS">=</option>
                                                            <option value="GREATER_OR_EQUAL">&gt;=</option>
                                                            <option value="LESS_OR_EQUAL">&lt;=</option>
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <label className="text-sm font-semibold">Choose severity:</label>
                                                        <select
                                                            value={rule.ruleSeverity}
                                                            onChange={(e) => handleRuleChange(index, "ruleSeverity", e.target.value)}
                                                            className="p-1 border rounded bg-white w-24 text-sm cursor-pointer"
                                                        >
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
                                        <button
                                            type="submit"
                                            className="py-2 px-4 bg-gray-400 font-bold rounded cursor-pointer hover:bg-gray-500">
                                            Legg til
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* Sensor button for On/Off */}

            {/* Sensor button for On/Off */}

            {sensorMode && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 shadow-xl flex flex-col gap-4">

                        <p className="text-lg font-bold">Slå av/på sensor</p>

                        <p className="text-sm text-gray-600">
                            Sensor:{" "}
                            <span className="font-semibold">
                    {sensorMode.sensorSerial}
                </span>
                        </p>

                        <p className="text-sm text-gray-600">
                            Rom:{" "}
                            <span className="font-semibold">
                    {sensorMode.roomCode} - {sensorMode.roomFloor ?? ""}
                </span>
                        </p>

                        <p className="text-sm text-gray-600">
                            Nåværende status:{" "}
                            <span
                                className={`font-bold ${
                                    sensorMode.sensorStatus
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                    {sensorMode.sensorStatus ? "Aktiv" : "Inaktiv"}
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
                                onClick={async () => {
                                    try {

                                        const updatedSensor = {
                                            ...sensorMode,
                                            sensorStatus: !sensorMode.sensorStatus
                                        };

                                        await api.updateSensorStatus(updatedSensor);

                                        await fetchSensors(selectedBuilding?.id || null);

                                        setSelectedSensor(updatedSensor);

                                        alert(
                                            `Sensor ${updatedSensor.sensorSerial} har blitt ${
                                                updatedSensor.sensorStatus
                                                    ? "aktivert"
                                                    : "deaktivert"
                                            }`
                                        );

                                        setSensorMode(null);

                                    } catch (error) {
                                        console.error("Feil ved oppdatering av sensorstatus:", error);
                                        alert("Kunne ikke oppdatere sensorstatus");
                                    }
                                }}
                                className={`flex-1 py-2 text-white font-semibold rounded cursor-pointer ${
                                    sensorMode.sensorStatus
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {sensorMode.sensorStatus ? "Slå av" : "Slå på"}
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Settings;