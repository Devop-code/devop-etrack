import React, { useEffect } from 'react';
import { Info } from 'lucide-react';
interface NotificationProps{
    message : string;
    onclose: ()=> void;
}

const Notification:React.FC<NotificationProps> = ({message,onclose}) => {
  useEffect(()=>{
    const timer = setTimeout(()=>{
      onclose()
    },5000)
    return ()=>{
      clearTimeout(timer)
    }
  },[onclose])
    return (
    <div className="toast toast-bottom toast-left">
    <div className="alert alert-success p-2 text-sm shadow-lg">
      <span className="flex items-center text-white">
        <Info className="w-4 mr-2 font-bold text-accent"/>
          {message}
        </span>
    </div>
  </div>
  );
}

export default Notification;
