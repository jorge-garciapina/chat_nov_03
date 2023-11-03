import React from "react";

const ConversationHeader = ({ onlineFriends, interlocutors, username }) => {
  return (
    <div>
      <h1>Conversation Component:</h1>
      <p>Username: {username || "N/A"}</p>
      {/* Loop through interlocutors and display each one's status */}
      {interlocutors && interlocutors.length > 0 ? (
        interlocutors.map((intloc, index) => (
          <div key={index}>
            <p>Interlocutor: {intloc}</p>
            <p>
              Interlocutor Status:{" "}
              {onlineFriends.includes(intloc) ? "Online" : "Offline"}
            </p>
          </div>
        ))
      ) : (
        <p>Interlocutors: N/A</p>
      )}
    </div>
  );
};

export default ConversationHeader;
