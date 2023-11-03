import React from "react";
import { useSelector } from "react-redux";

const GeneralNotifications = () => {
  // Access the notifications from the Redux state
  const notifications = useSelector((state) => state.notifications);

  return (
    <div className="notifications">
      <h1>Notifications component:</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default GeneralNotifications;
