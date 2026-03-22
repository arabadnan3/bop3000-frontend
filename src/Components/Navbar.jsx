import React from 'react'

function Navbar({activePage, setActivePage}) {
  return (
    <div>
      <h1 className=" text-3xl p-6 bg-gray-300 border text-black font-bold mb-4">USN Studentbygg - CO2 Observasjon</h1>
       <div className="flex justify-between items-center px-4 py-2 bg-gray-200 border-b">
        <div className="flex gap-2">
          <button onClick={() => setActivePage('dashboard')} className=" text-lg font-bold text-black-700 mb-6 p-2 bg-gray-300 border rounded cursor-pointer hover:underline">Dashboard </button>
            <button onClick={() => setActivePage('sensor')} className="text-lg font-bold text-black-700 ms-2 border rounded mb-6 p-2 bg-gray-300 cursor-pointer hover:underline"> Sensor  </button>
            <button onClick={() => setActivePage('notifikasjoner')} className="text-lg font-bold text-black-700 ms-2 border rounded mb-6 p-2 bg-gray-300 cursor-pointer hover:underline"> Notifikasjoner </button>
            <button onClick={() => setActivePage('settings')} className="text-lg font-bold text-black-700 ms-2 border rounded mb-6 p-2 bg-gray-300 cursor-pointer hover:underline"> Settings </button> 
        </div>


       </div>

    </div>
  )
}

export default Navbar
