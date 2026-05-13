import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const chartData = [
    { time: "01.00", co2: 100},
    { time: "02.00", co2: 100},
    { time: "03.00", co2: 100},
    { time: "04.00", co2: 100},
    { time: "05.00", co2: 100},
    { time: "06.00", co2: 100},
    { time: "07.00", co2: 100},
    { time: "08.00", co2: 100},
    { time: "09.00", co2: 100},
    { time: "10.00", co2: 100},
    { time: "11.00", co2: 200 },
    { time: "12.00", co2: 600 },
    { time: "13.00", co2: 800 },
    { time: "14.00", co2: 780 },
    { time: "15.00", co2: 1300 },
    { time: "16.00", co2: 1100 },
    { time: "17.00", co2: 1800 },
    { time: "18.00", co2: 900 },
    { time: "19.00", co2: 900 },
    { time: "20.00", co2: 850 },
    { time: "21.00", co2: 940 },
    { time: "22.00", co2: 650 },
    { time: "23.00", co2: 1120 },
    { time: "24.00", co2: 900 },
];

function CardDetail({ data }) {
    const tenantName =
        data.tenantFirstName || data.tenantLastName
            ? `${data.tenantFirstName ?? ''} ${data.tenantLastName ?? ''}`.trim()
            : 'Ingen leietaker';

    const formatSensorStatus = (status) => {
        const normalizedStatus = String(status).trim().toUpperCase();

        if (normalizedStatus === 'TRUE') {
            return <span className="text-green-600 font-medium">Aktiv</span>;
        }

        if (normalizedStatus === 'FALSE') {
            return <span className="text-red-600 font-medium">Inaktiv</span>;
        }
        return 'Ikke tilgjengelig';
    };

    return (
        <div className="bg-gray-300 border p-3 rounded-lg py-5 px-5">
            <p><span className="font-bold">Adresse:</span> {data.address}</p>
            <p><span className="font-bold">Romnr:</span> {data.roomCode}</p>
            <p><span className="font-bold">Etasje:</span> {data.floor}. etg</p>
            <p><span className="font-bold">Leietaker:</span> {tenantName}</p>
            <p><span className="font-bold">Telefon:</span> {data.tenantPhone || 'Ikke tilgjengelig'}</p>
            <p><span className="font-bold">E-post:</span> {data.tenantEmail || 'Ikke tilgjengelig'}</p>
            <p><span className="font-bold">Rom areal:</span> {data.roomSize} m²</p>

            <div className="mt-6">
                <p className="font-bold text-lg mb-3">Sensorer:</p>

                {data.sensors && data.sensors.length > 0 ? (
                    data.sensors.map((sensor, index) => (
                        <div
                            key={sensor.sensorSerial || index}
                            className="bg-white rounded-lg p-4 mb-4 shadow"
                        >
                            <p>
                                <span className="font-bold">Sensor serienummer:</span>{' '}
                                {sensor.sensorSerial || 'Ikke tilgjengelig'}
                            </p>
                            <p>
                                <span className="font-bold">Sensor status:</span>{' '}
                                {formatSensorStatus(sensor.sensorStatus)}
                            </p>
                            <p>
                                <span className="font-bold">Sensor batteri:</span>{' '}
                                {sensor.sensorBattery}%
                            </p>
                            <p>
                                <span className='font-bold'>Sensor måling:</span>{' '}
                                {sensor.latestReading?.value ?? 'Ikke tilgjengelig'}
                            </p>
                            <div className="mt-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="co2"
                                            stroke="red"
                                            dot={false}
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <p className="text-sm text-gray-600 mt-2">
                                Sist oppdatert: {sensor.latestReading?.timeStamp || 'Ikke tilgjengelig'}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Ingen sensorer tilgjengelig</p>
                )}
            </div>

            <p className="font-bold mt-4">
                <span className="cursor-pointer hover:underline">Slå av sensor</span>
            </p>
        </div>
    );
}

export default CardDetail;