import React from 'react'

function Navbar() {
  return (
    <div>
        <button className=" text-lg font-bold text-black-700 mb-6 p-2 bg-gray-300 border rounded cursor-pointer hover:underline">Dashboard </button>
        <button className="text-lg font-bold text-black-700 ms-2 border rounded mb-6 p-2 bg-gray-300 cursor-pointer hover:underline"> Sensor  </button>
        <button className="text-lg font-bold text-black-700 ms-2 border rounded mb-6 p-2 bg-gray-300 cursor-pointer hover:underline"> Notifikasjoner </button> 
        <p className="text-lg text-black-700 font-bold mb-4 p-2 cursor-pointer hover:underline ">  VARSLINGER </p>
      
    </div>
  )
}

export default Navbar
