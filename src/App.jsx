import React, { useState } from 'react'
import CardDetail from './Components/CardDetail';
import Navbar from './Components/Navbar'

const mockData = [
  { id: 1, building: "Luna (Bredalsveien 16C)", room: "Rom 303", floor: "3. Etg.", status: "Feil med sensor", co2Value: null, leietaker: "Hans Roger", areal: 30, sensorId: 1001 },
  { id: 2, building: "Terra (Breadalsveien 16B)", room: "Rom 109", floor: "1. Etg.", status: "Farlig Co2 Nivå!", co2Value: 1200, leietaker: "Kari Olsen", areal: 25, sensorId: 1002 },
  { id: 3, building: "Terra (Bredalsveien 16B)", room: "Rom 202", floor: "2. Etg.", status: "Feil med sensor", co2Value: null, leietaker: "Per Hansen", areal: 20, sensorId: 1003 },
  { id: 4, building: "Omega (Bredalsvein 16A)", room: "Rom 405", floor: "4. Etg", status: "Farlig Co2 Nivå!", co2Value: 900, leietaker: "Line Berg", areal: 35, sensorId: 1004 },
  { id: 5, building: "Luna (Bredalsveien 16C)", room: "Rom 101", floor: "1. Etg", status: "Normalt Co2 Nivå", co2Value: 600, leietaker: "Sara Lie", areal: 22, sensorId: 1005 },
  { id: 6, building: "Omega (Bredalsvein 16A)", room: "Rom 210", floor: "2. Etg", status: "Normalt Co2 Nivå", co2Value: 750, leietaker: "Erik Dahl", areal: 28, sensorId: 1006 },
  { id: 7, building: "Luna (Bredalsveien 16C)", room: "Rom 412", floor: "4. Etg", status: "Farlig Co2 Nivå!", co2Value: 1350, leietaker: "Mona Vik", areal: 18, sensorId: 1007 },
  { id: 8, building: "Terra (Bredalsveien 16B)", room: "Rom 305", floor: "3. Etg", status: "Feil med sensor", co2Value: null, leietaker: "Jonas Nær", areal: 32, sensorId: 1008 },
  { id: 9, building: "Omega (Bredalsvein 16A)", room: "Rom 108", floor: "1. Etg", status: "Farlig Co2 Nivå!", co2Value: 980, leietaker: "Ida Storm", areal: 27, sensorId: 1009 },
  { id: 10, building: "Luna (Bredalsveien 16C)", room: "Rom 204", floor: "2. Etg", status: "Normalt Co2 Nivå", co2Value: 500, leietaker: "Ole Strand", areal: 24, sensorId: 1010 },
];

function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState('');

  // Grupper data etter bygg og rett stavemåter
  const buildings = mockData.reduce((acc, item) => {
    const correctedBuilding = item.building
        .replace('Breadalsveien', 'Bredalsveien')
        .replace('Bredalsvein', 'Bredalsveien');

    const correctedItem = {
      ...item,
      building: correctedBuilding
    };

    if (!acc[correctedBuilding]) acc[correctedBuilding] = [];
    acc[correctedBuilding].push(correctedItem);
    return acc;
  }, {});

  const buildingList = Object.keys(buildings);

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
                    setSelectedCard(null);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              >
                <option value="">Velg et bygg</option>
                {buildingList.map((building) => (
                    <option key={building} value={building}>
                      {building}
                    </option>
                ))}
              </select>
            </div>

            {selectedBuilding && (
                <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-xl">
                  <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">
                    {selectedBuilding} - Rom
                  </h3>

                  <div className="space-y-3">
                    {buildings[selectedBuilding].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedCard(item)}
                            className={`w-full text-left p-4 rounded-lg border transition duration-200 ${
                                selectedCard?.id === item.id
                                    ? 'bg-blue-100 border-blue-400'
                                    : 'bg-gray-50 border-gray-200 hover:bg-blue-50'
                            }`}
                        >
                          <div className="font-semibold text-gray-800">{item.room}</div>
                          <div className="text-sm text-gray-600">{item.floor}</div>
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

export default App;