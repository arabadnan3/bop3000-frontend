import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts'

const chartData = [
  { time: "12.00", co2: 200 },
  { time: "14.00", co2: 600 },
  { time: "16.00", co2: 800 },
  { time: "18.00", co2: 780 },
  { time: "20.00", co2: 1300 },
  { time: "22.00", co2: 1100 },
  { time: "24.00", co2: 900 },
];

function CardDetail({data}) {
  const tenantName =
        data.tenantFirstName || data.tenantLastName
            ? `${data.tenantFirstName ?? ''} ${data.tenantLastName ?? ''}`.trim()
            : 'Ingen leietaker';
  const handleRoomClick = async (roomId) => {
    
    try {
        setCardLoading(true);
        const roomDetails = await api.getRoomDetails(roomId);
        console.log("API returned:", roomDetails); 
        setSelectedCard(roomDetails);
    } catch (err) {
        setCardError('Failed to load room details');
        console.error(err);
    } finally {
        setCardLoading(false);
    }
};        


  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl">
      <p className="text-slate-100"><span className="font-bold text-white">Adresse:</span> {data.address}</p>
      <p className="text-slate-100"><span className="font-bold text-white">Rom:</span> {data.roomCode}</p>
      <p className="text-slate-100"><span className="font-bold text-white">Etasje:</span> {data.floor}</p>
      <p className="text-slate-100"><span className="font-bold text-white">Leietaker:</span> {tenantName}</p>
      <p className="text-slate-100"><span className="font-bold text-white">Telefon:</span> {data.tenantPhone || 'Ikke tilgjengelig'}</p>
      <p className="text-slate-100"><span className="font-bold text-white">E-post:</span> {data.tenantEmail || 'Ikke tilgjengelig'}</p>
      <p className="text-slate-100"><span className="font-bold text-white">Rom areal:</span> {data.roomSize} m²</p>
      <p className="text-slate-100"><span className="font-bold text-white">Sensor serienummer:</span> {data.sensorSerial || 'Ikke tilgjengelig'}</p>
      <p className="text-slate-100"><span className="font-bold text-white">Sensor status:</span> {data.sensorStatus}</p>
      

       <div className="bg-slate-700 mt-6 p-4 rounded-lg border border-slate-600">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="time" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#e2e8f0' }} />
            <Line type="monotone" dataKey="co2" stroke="#ef4444" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-slate-400 mt-1">Sist oppdatert: kl. 19.02</p>
      <p className="font-bold mt-4 text-slate-100">
        <span className="cursor-pointer hover:text-blue-400 hover:underline transition duration-200">Kontakt leietaker</span>
        {" | "}
        <span className="cursor-pointer hover:text-blue-400 hover:underline transition duration-200">Slå av sensor</span>
      </p>



      
    </div>
  );
}

export default CardDetail
