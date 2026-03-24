import React, { useState } from "react";
import Settings from "./Components/Settings";
import { mockBuildings } from "./Components/mockData";

function App() {
  const [activePage, setActivePage] = useState("settings");

  return (
      <Settings
          buildingData={mockBuildings}
          setActivePage={setActivePage}
      />
  );
}

export default App;