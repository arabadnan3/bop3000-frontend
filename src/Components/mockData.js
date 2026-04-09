

export const mockData = [
    { id: 1, building: "Luna (Bredalsveien 16C)", room: "Rom 303", floor: "3. Etg.", status: "Feil med sensor", co2Value: null, leietaker: "Hans Roger", areal: 30, sensorId: 1001 },
    { id: 2, building: "Terra (Bredalsveien 16B)", room: "Rom 109", floor: "1. Etg.", status: "Farlig Co2 Nivå!", co2Value: 1200, leietaker: "Kari Olsen", areal: 25, sensorId: 1002 },
    { id: 3, building: "Terra (Bredalsveien 16B)", room: "Rom 202", floor: "2. Etg.", status: "Feil med sensor", co2Value: null, leietaker: "Per Hansen", areal: 20, sensorId: 1003 },
    { id: 4, building: "Omega (Bredalsvein 16A)", room: "Rom 405", floor: "4. Etg.", status: "Farlig Co2 Nivå!", co2Value: 900, leietaker: "Line Berg", areal: 35, sensorId: 1004 },
    { id: 5, building: "Luna (Bredalsveien 16C)", room: "Rom 101", floor: "1. Etg.", status: "Normalt Co2 Nivå", co2Value: 600, leietaker: "Sara Lie", areal: 22, sensorId: 1005 },
    { id: 6, building: "Omega (Bredalsvein 16A)", room: "Rom 210", floor: "2. Etg.", status: "Normalt Co2 Nivå", co2Value: 750, leietaker: "Erik Dahl", areal: 28, sensorId: 1006 },
    { id: 7, building: "Luna (Bredalsveien 16C)", room: "Rom 412", floor: "4. Etg.", status: "Farlig Co2 Nivå!", co2Value: 1350, leietaker: "Mona Vik", areal: 18, sensorId: 1007 },
    { id: 8, building: "Terra (Bredalsveien 16B)", room: "Rom 305", floor: "3. Etg.", status: "Feil med sensor", co2Value: null, leietaker: "Jonas Nær", areal: 32, sensorId: 1008 },
    { id: 9, building: "Omega (Bredalsvein 16A)", room: "Rom 108", floor: "1. Etg.", status: "Farlig Co2 Nivå!", co2Value: 980, leietaker: "Ida Storm", areal: 27, sensorId: 1009 },
    { id: 10, building: "Luna (Bredalsveien 16C)", room: "Rom 204", floor: "2. Etg.", status: "Normalt Co2 Nivå", co2Value: 500, leietaker: "Ole Strand", areal: 24, sensorId: 1010 },
];

export const mockBuildings = [
    { id: 1, name: "Luna", address: "Bredalsveien 16B", poststed: "Hønefoss", postnummer: "3511" },
    { id: 2, name: "Terra", address: "Bredalsveien 16A", poststed: "Hønefoss", postnummer: "3511" },
    { id: 3, name: "Sigma", address: "Bredalsveien 16C", poststed: "Hønefoss", postnummer: "3511" },
    { id: 4, name: "Omega", address: "Bredalsveien 16D", poststed: "Hønefoss", postnummer: "3511" },
];

export const sensorAlerts =[
    { id: 2, building: "Terra (Bredalsveien 16B)", room: "Rom 109", floor: "1. Etg.", co2Value: 1200, severity: "CRITICAL", leietaker: "Kari Olsen", areal: 25, sensorId: 2, sensorSerial: "SN-CO2-002" },
    { id: 4, building: "Omega (Bredalsveien 16A)", room: "Rom 405", floor: "4. Etg.", co2Value: 900, severity: "CRITICAL", leietaker: "Line Berg", areal: 35, sensorId: 4, sensorSerial: "SN-CO2-004" },
    { id: 7, building: "Luna (Bredalsveien 16C)", room: "Rom 412", floor: "4. Etg.", co2Value: 1350, severity: "CRITICAL", leietaker: "Mona Vik", areal: 18, sensorId: 7, sensorSerial: "SN-CO2-007" },
    { id: 12, building: "Sigma (Bredalsveien 16D)", room: "Rom 202", floor: "2. Etg.", co2Value: 1300, severity: "CRITICAL", leietaker: "Bjørn Lie", areal: 25, sensorId: 12, sensorSerial: "SN-CO2-012" },
    { id: 6, building: "Omega (Bredalsveien 16A)", room: "Rom 210", floor: "2. Etg.", co2Value: 750, severity: "WARNING", leietaker: "Erik Dahl", areal: 28, sensorId: 6, sensorSerial: "SN-CO2-006" },
    { id: 9, building: "Omega (Bredalsveien 16A)", room: "Rom 108", floor: "1. Etg.", co2Value: 980, severity: "WARNING", leietaker: "Ida Storm", areal: 27, sensorId: 9, sensorSerial: "SN-CO2-009" },

];

