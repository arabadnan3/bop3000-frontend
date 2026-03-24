import React , {useState} from 'react'
import Navbar from './Navbar';

function Settings({ buildingData }) {
    const [activeTab, setActiveTab] = useState("");
    const[selectedBuilding, setSelectedBuilding] = useState(null);
    return (
        <div>
            <div>
                <h1 className="text-4xl p-8 bg-white text-black font-bold mb-6 shadow-lg rounded-b-lg border-b">
                    USN Studentbygg - CO2 Observasjon
                </h1>
            </div>
            <Navbar />
            <div className="flex items-center justify-between px-6 mt-4 border-b border-gray-300 pb-2">
                <p className="text-lg font-bold underline">Kontroll panel</p>
                <div className="flex gap-2 mt-2">
                    <button onClick={() => setActiveTab("bygninger")}className={`pb-2 font-bold color-black cursor-pointer ${activeTab === "bygninger" ? "border-b-2 rounded border-black-500 bg-gray-300 text-black-600" : "text-gray-900"}`}
                    > Legg til bygning
                    </button>
                    <button onClick={() => setActiveTab("sensorer")}className={`pb-2 font-bold color-black cursor-pointer ${activeTab === "sensorer" ? "border-b-2 rounded border-black-500 bg-gray-300 text-black-500" : "text-gray-900  "}`}
                    > Legg til sensor
                    </button>
                </div>
            </div>
            <div className="flex gap-4 px-6 mt-4 border-b border-gray-300">
                <div className="w-72 shrink-0 flex flex-col gap-2">
                    <div className="overflow-y-scroll border-gray-300 p-2 mt-2">
                        {buildingData.map(building => (
                            <div
                                key={building.id}
                                onClick={() => setSelectedBuilding(building)}
                                className={`bg-gray-200 border rounded p-3 mb-3 cursor-pointer ${selectedBuilding?.id === building.id ? "bg-gray-400 border black" : "bg-gray-300"
                                }`}
                            >
                                <p className="text-xl font-semibold mb-2">{building.name}</p>
                                <p className="text-sm text-gray-500 mb-1">{building.address}</p>
                                <p className="text-sm text-gray-500 mb-1">{building.postnummer} {building.poststed}</p>
                            </div>

                        ))}
                    </div>
                </div>
                <div className="flex-1 border border-gray-300 rounded bg-gray-300 p-4 ">
                    {activeTab === "" && selectedBuilding && (
                        <div className="flex flex-col gap-4">
                            <p className="text-lg font-bold">{selectedBuilding.name}</p>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Adresse:</label>
                                <input type="text" value={selectedBuilding.address} className="p-2 border rounded bg-gray-300 w-70" readOnly />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Postnummer:</label>
                                <input type="text" value={selectedBuilding.postnummer} className="p-2 border rounded bg-gray-300" readOnly />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Poststed:</label>
                                <input type="text" value={selectedBuilding.poststed} className="p-2 border rounded bg-gray-300" readOnly />
                            </div>
                        </div>
                    )}
                    {activeTab === "" && !selectedBuilding && (
                        <p className="text-gray-500 text-center mt-10">Velg en bygning eller et alternativ for å komme i gang</p>
                    )}
                    {activeTab === "bygninger" && (
                        <div className="flex flex-col gap-4">
                            <p className="text-lg font-bold">Legg til bygning</p>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Bygning navn:  </label>
                                <input type="text" placeholder="Bygning navn" className="p-2 border bg-white rounded w-70" />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold ">Adresse:  </label>
                                <input type="text" placeholder="Adresse" className="p-2 border rounded bg-white w-70" />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Postnummer:  </label>
                                <input type="text" placeholder="Postnummer" className="p-2 border rounded  bg-white" />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Poststed:  </label>
                                <input type="text" placeholder="Poststed" className="p-2 border rounded  bg-white" />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Antall room :  </label>
                                <input type="text" placeholder="Antall room" className="w-30 p-1 border rounded  bg-white"/>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Antall Etasjer:  </label>
                                <input type="text" placeholder="Antall Etasjer" className="w-30 p-1 border rounded  bg-white"  />
                            </div>
                            <button className="items-center w-25 py-2 text-black font-bold rounded bg-gray-400 cursor-pointer">Legg til</button>
                            <p className="text-black font-semibold mt-4 underline ms-300 cursor-pointer">Endre Bygninginformasjon</p>
                            <p className="text-black font-semibold underline ms-300 cursor-pointer">Legg til rom</p>
                        </div>
                    )}
                    {activeTab === "sensorer" && (
                        <div className="flex flex-col gap-4">
                            <p className="text-lg font-bold">Legg til sensor</p>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Sensor serienr:  </label>
                                <input type="text" placeholder="Sensor serienr" className="p-2 border bg-white rounded w-70" />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Sensor type:  </label>
                                <input type="text" placeholder="Sensor type" className="p-2 border rounded bg-white w-70" />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Adresse:  </label>
                                <input type="text" placeholder="Adresse" className="p-2 border rounded bg-white w-70" />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Etasje:  </label>
                                <input type="text" placeholder="Etasje" className="p-2 border rounded bg-white w-70" />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Romnr:  </label>
                                <input type="text" placeholder="Romnr" className="p-2 border rounded bg-white w-70" />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="w-36 text-right font-bold">Sensor regel:  </label>
                                <input type="text" placeholder="Send varsel når: >700 ppm" className="p-2 border rounded bg-white w-70" />
                                <input type="text" placeholder="Send varsel når: >600 ppm" className="p-2 border rounded bg-white w-70" />
                                <input type="text" placeholder="Send varsel når: >500 ppm" className="p-2 border rounded bg-white w-70" />
                            </div>
                            <button className="items-center w-25 py-2 text-black font-bold rounded bg-gray-400 cursor-pointer">Legg til</button>
                            <p className="text-black font-semibold mt-4 underline ms-300 cursor-pointer">Slå av/på sensor</p>
                            <p className="text-black font-semibold underline ms-300 cursor-pointer">Endre sensorinformasjon</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
