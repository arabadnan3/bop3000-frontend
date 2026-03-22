import { FaExclamationTriangle } from 'react-icons/fa';

function StatusColor({status, co2Value}) {
  if (status === "Feil med sensor") {
    return <FaExclamationTriangle className="text-yellow-500 text-xl" />;
  }
  if (co2Value == null ) return null 

    if (co2Value <= 800) return <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
    if (co2Value <= 1000) return <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
    return <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
   
  
  
}
export default StatusColor