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
    <div className="bg-gray-300 border p-3 rounded-lg py-5 px-5">
      <p><span className="font-bold">Adresse:</span> {data.building}</p>
      <p><span className="font-bold">Rom:</span> {data.room}</p>
      <p><span className="font-bold">Etasje:</span> {data.floor}</p>
      <p><span className="font-bold">Leietaker:</span> {data.leietaker}</p>
      <p><span className="font-bold">Rom areal:</span> {data.areal} m²</p>
      <p><span className="font-bold">Sensor ID:</span> {data.sensorId}</p>

       <div className="bg-white mt-6 p-3 rounded">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="co2" stroke="red" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-600 mt-1">Sist oppdatert: kl. 19.03</p>
      <p className="font-bold mt-4">
        <span className="cursor-pointer hover:underline">Kontakt leietaker</span>
        {" | "}
        <span className="cursor-pointer hover:underline">Slå av sensor</span>
      </p>



      
    </div>
  );
}

export default CardDetail
