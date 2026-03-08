import React , { useState }from 'react'
import Card from './Components/Card'
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
  return (
    <div className=" bg-gray-100 min-h-screen">
      <div>
        <h1 className=" text-3xl p-6 bg-gray-300 border text-black font-bold mb-4">USN Studentbygg - CO2 Observasjon</h1>
        <Navbar />
        </div>
        
        <div className="flex gap-4 px-6"> 

        <div className=" h-screen overflow-y-scroll w-84 p-2 border-gray-300">
          {mockData.map((props) => (
            <div key={props.id} onClick={() => setSelectedCard(props)} className='cursor-pointer'>
              <Card  building={props.building} room={props.room} floor={props.floor} status={props.status} co2Value={props.co2Value} />
            </div>
          ))}
        </div> 

        <div className='flex-1 p-6'>
          {selectedCard ? (
            <CardDetail data={selectedCard} />
          ) : (
            <p className="text-gray-500">Klikk på et kort for å se detaljer</p>
          )}
        </div>
      </div>
    </div>
   

  );
   
}

export default App


