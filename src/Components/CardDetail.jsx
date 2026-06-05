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

const formatChartData = (sensorLog) => {
    return sensorLog
        ?.slice()
        .reverse()
        .filter((_, index) => index % 2 === 0)
        .map((reading) => ({
            time: new Date(reading.hour).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }),
            co2: reading.avgValue,
            severity: reading.severityLevel
        }));
};

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
                                    <LineChart data={formatChartData(sensor.sensorLog)}>
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
        </div>
    );
}

export default CardDetail;