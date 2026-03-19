import React, { useState, useEffect } from 'react';
import Card from './Components/Card';
import CardDetail from './Components/CardDetail';
import Navbar from './Components/Navbar';
import { api } from './services/api';

function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [rooms, buildings, leaseRooms, leases, tenants, sensors] = await Promise.all([
        api.getRooms(),
        api.getBuildings(),
        api.getLeaseRooms(),
        api.getLeases(),
        api.getTenants(),
        api.getSensors()
      ]);

      const combinedData = rooms.map(room => {
        const building = buildings.find(b => b.id === room.building?.id);
        const leaseRoom = leaseRooms.find(lr => lr.room?.id === room.id);
        const lease = leaseRoom ? leases.find(l => l.id === leaseRoom.lease?.id) : null;
        const tenant = lease ? tenants.find(t => t.id === lease.tenant?.id) : null;
        const sensor = sensors.find(s => s.room?.id === room.id);

        // Bestem status basert på sensor
        let status = "Ingen sensor";
        let co2Value = null;

        if (sensor) {
          if (sensor.sensorStatus === "error" || sensor.sensorStatus === "feil") {
            status = "Feil med sensor";
          } else {
            status = "Normalt CO2 Nivå";
          }
        }

        return {
          id: room.id,
          building: building ? `${building.name} (${building.adresse})` : 'Ukjent',
          room: `Rom ${room.roomCode}`,
          floor: `${room.roomFloor}. Etg.`,
          status: status,
          co2Value: co2Value,
          leietaker: tenant ? `${tenant.first_name} ${tenant.last_name}` : 'Ingen leietaker',
          areal: room.roomSize,
          sensorId: sensor ? sensor.id : null,
          sensorSerial: sensor ? sensor.sensorSerial : null,
          sensorBattery: sensor ? sensor.sensorBattery : null
        };
      });

      setDashboardData(combinedData);
      setError(null);
    } catch (err) {
      console.error('Feil ved henting av data:', err);
      setError('Kunne ikke hente data fra serveren');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <p className="text-xl">Laster data...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <p className="text-xl text-red-500">{error}</p>
        </div>
    );
  }

  return (
      <div className="bg-gray-100 min-h-screen">
        <div>
          <h1 className="text-3xl p-6 bg-gray-300 border text-black font-bold mb-4">
            USN Studentbygg - CO2 Observasjon
          </h1>
          <Navbar />
        </div>

        <div className="flex gap-4 px-6">
          <div className="h-screen overflow-y-scroll w-84 p-2 border-gray-300">
            {dashboardData.map((props) => (
                <div
                    key={props.id}
                    onClick={() => setSelectedCard(props)}
                    className="cursor-pointer"
                >
                  <Card
                      building={props.building}
                      room={props.room}
                      floor={props.floor}
                      status={props.status}
                      co2Value={props.co2Value}
                  />
                </div>
            ))}
          </div>

          <div className="flex-1 p-6">
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

export default App;