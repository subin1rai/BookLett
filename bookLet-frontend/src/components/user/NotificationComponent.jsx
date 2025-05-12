import React, { useEffect, useState, useRef } from "react";
import { startSignalRConnection } from "./notificationHub";

const NotificationComponent = () => {
  const [currentMessage, setCurrentMessage] = useState(null);
  const messageQueue = useRef([]);
  const processingRef = useRef(false);

  useEffect(() => {
    startSignalRConnection((msg) => {
      messageQueue.current.push(msg);
      processQueue();
    });
  }, []);

  const processQueue = () => {
    if (processingRef.current || messageQueue.current.length === 0) return;

    processingRef.current = true;
    const nextMessage = messageQueue.current.shift();
    setCurrentMessage(nextMessage);

    setTimeout(() => {
      setCurrentMessage(null);
      processingRef.current = false;
      processQueue();
    }, 3000);
  };

  if (!currentMessage) return null;

  return (
    <div className="p-4">
      <div className="bg-web-secondary text-web-primary p-3 rounded shadow">
        {currentMessage}
      </div>
    </div>
  );
};

export default NotificationComponent;
