import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { api } from '../services/api';

function Warnings() {
    const [filter, setFilter] = useState("alle");
    const [expandedId, setExpandedId] = useState(null);
    const [sensorAlerts, setSensorAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const data = await api.getAllSensorAlertCards();
            setSensorAlerts(data);
        } catch (err) {
            console.error("Feil:", err);
        } finally {
            setLoading(false);
        }
    };

    const activeAlerts = sensorAlerts;

    const filtered = activeAlerts.filter(alert => {
        if (filter === "alle") return true;
        if (filter === "critical") return alert.ruleSeverity === "CRITICAL";
        if (filter === "warning") return alert.ruleSeverity === "WARNING";
        return true;
    });

    const criticalCount = activeAlerts.filter(alert => alert.ruleSeverity === "CRITICAL").length;
    const warningCount = activeAlerts.filter(alert => alert.ruleSeverity === "WARNING").length;

    const getSensorUnit = (sensorType) => {
        switch (sensorType) {
            case "CO2":
                return "ppm";
            case "HUMIDITY":
                return "%";
            case "PRESSURE":
                return "Pa";
            case "TEMPERATURE":
                return "°C";
            default:
                return "";
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Navbar />
                <p className="text-center mt-20">Laster...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="bg-white px-6 pt-6 min-h-screen">
                <div className="flex items-center border-b border-gray-300 pb-3 mb-4">
                    <p className="text-lg font-bold underline">Varslinger</p>
                </div>

                <div className="flex gap-2 mb-4">
                    {[
                        { key: "alle", label: `Alle (${activeAlerts.length})` },
                        { key: "critical", label: `Critical (${criticalCount})` },
                        { key: "warning", label: `Warning (${warningCount})` },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold border cursor-pointer ${
                                filter === key
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col">
                    {filtered.length === 0 ? (
                        <p className="text-gray-400 text-center mt-20">Ingen aktive varslinger</p>
                    ) : (
                        filtered.map((alert, index) => {
                            const isExpanded = expandedId === alert.id;
                            const isCritical = alert.ruleSeverity === "CRITICAL";
                            const isWarning = alert.ruleSeverity === "WARNING";

                            return (
                                <div
                                    key={`${alert.id}-${index}`}
                                    className={`border-b border-gray-200 py-4 px-2 ${
                                        isCritical
                                            ? "bg-red-50"
                                            : isWarning
                                                ? "bg-yellow-50"
                                                : "bg-gray-50"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-4 h-4 rounded-full shrink-0 ${
                                                    isCritical
                                                        ? "bg-red-500"
                                                        : isWarning
                                                            ? "bg-yellow-400"
                                                            : "bg-gray-400"
                                                }`}
                                            />

                                            <div>
                                                <p className="font-bold">
                                                    {alert.buildingName} - Rom {alert.roomCode}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {alert.sensorSerial} - {alert.roomFloor}. Etg.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                    isCritical
                                                        ? "bg-red-100 text-red-700"
                                                        : isWarning
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {alert.ruleSeverity}
                                            </span>

                                            <p
                                                className={`text-xl font-bold ${
                                                    isCritical
                                                        ? "text-red-600"
                                                        : isWarning
                                                            ? "text-yellow-600"
                                                            : "text-gray-600"
                                                }`}
                                            >
                                                {alert.triggerValue} {getSensorUnit(alert.sensorType)}
                                            </p>

                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                                                className="text-sm text-gray-500 underline cursor-pointer hover:text-black"
                                            >
                                                {isExpanded ? "Lukk" : "Se detaljer"}
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-3 ml-8 p-3 bg-white border border-gray-200 rounded flex flex-col gap-2">
                                            <p className="text-sm">
                                                <span className="font-bold">Sensor ID: </span>
                                                {alert.sensorId}
                                            </p>

                                            <p className="text-sm">
                                                <span className="font-bold">{alert.sensorType} verdi: </span>
                                                <span
                                                    className={`font-bold ${
                                                        isCritical
                                                            ? "text-red-600"
                                                            : isWarning
                                                                ? "text-yellow-600"
                                                                : "text-gray-600"
                                                    }`}
                                                >
                                                    {alert.triggerValue} {getSensorUnit(alert.sensorType)}
                                                </span>
                                            </p>

                                            <p className="text-sm">
                                                <span className="font-bold">Severity: </span>
                                                <span
                                                    className={`font-bold ${
                                                        isCritical
                                                            ? "text-red-600"
                                                            : isWarning
                                                                ? "text-yellow-600"
                                                                : "text-gray-600"
                                                    }`}
                                                >
                                                    {alert.ruleSeverity}
                                                </span>
                                            </p>

                                            <p className="text-sm">
                                                <span className="font-bold">Timestamp: </span>
                                                <span>
                                                    {alert.triggerTimestamp}
                                                </span>
                                            </p>

                                            <div className="border-t border-gray-200 my-1 pt-2">
                                                <p className="text-xs text-gray-400 font-semibold uppercase">Leietaker</p>

                                                <p className="text-sm">
                                                    <span className="font-bold">Navn: </span>
                                                    {alert.tenantFirstName} {alert.tenantLastName}
                                                </p>

                                                <p className="text-sm">
                                                    <span className="font-bold">Telefon: </span>
                                                    {alert.tenantPhone}
                                                </p>

                                                <p className="text-sm">
                                                    <span className="font-bold">E-post: </span>
                                                    {alert.tenantEmail}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Warnings;