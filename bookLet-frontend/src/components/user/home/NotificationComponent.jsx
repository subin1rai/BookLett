import React, { useEffect, useState } from "react";
import { startSignalRConnection } from "./notificationHub";

const NotificationComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    startSignalRConnection((msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  return (
    <div>
      <h2>Real-Time Notifications</h2>
      <ul>
        {messages.map((m, idx) => (
          <li key={idx}>{m}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
