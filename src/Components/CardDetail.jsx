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
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Rom Detaljer</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <p><span className="font-semibold">Adresse:</span> {data.building}</p>
        <p><span className="font-semibold">Rom:</span> {data.room}</p>
        <p><span className="font-semibold">Etasje:</span> {data.floor}</p>
        <p><span className="font-semibold">Leietaker:</span> {data.leietaker}</p>
        <p><span className="font-semibold">Rom areal:</span> {data.areal} m²</p>
        <p><span className="font-semibold">Sensor ID:</span> {data.sensorId}</p>
      </div>

       <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">CO2 Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="co2" stroke="#3b82f6" dot={false} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-500 mt-2">Sist oppdatert: kl. 19.02</p>
      <div className="mt-4 flex gap-4">
        <span className="text-blue-600 cursor-pointer hover:underline font-medium">Kontakt leietaker</span>
        <span className="text-red-600 cursor-pointer hover:underline font-medium">Slå av sensor</span>
      </div>



      
    </div>
  );
}

export default CardDetail
