import React from "react";
import { useSelector } from "react-redux";

// OTHER REACT COMPONENTS
import ContactList from "./ContactList";
import ContactRequests from "./ContactRequests";

const Contacts = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const { username, contactList, contactRequests } = userInfo;

  return (
    <div>
      <h1>Contacts component:</h1>
      <h3>Username: {username ? username : "Not available"}</h3>

      <h3>Contact List</h3>
      <ContactList contacts={contactList} />

      <h3>Contact Requests</h3>
      <ContactRequests requests={contactRequests} />
    </div>
  );
};

export default Contacts;
