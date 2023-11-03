import React from "react";
// REDUX LOGIC
import { useSelector, useDispatch } from "react-redux";
import { interlocutorIsOnline } from "./../../redux/actions";

// GRAPHQL LOGIC
import { useQuery } from "@apollo/client";
import { GET_USER_STATUS_QUERY } from "../../graphql/userQueries";

// OTHER REACT COMPONENTS
import ConversationHeader from "./ConversationHeader";
import ConversationMessages from "./ConversationMessages";
import SendMessageItem from "./sendMessageItem";

const Conversation = () => {
  // REDUX LOGIC:
  const username = useSelector((state) => state.userInfo.username);
  const interlocutors = useSelector(
    (state) => state.conversation.interlocutors
  );
  const onlineFriends = useSelector((state) => state.onlineFriends);
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.conversation.messages);

  // GRAPHQL LOGIC:
  const { data } = useQuery(GET_USER_STATUS_QUERY, {
    skip: !interlocutors || interlocutors.length === 0,
    variables: { usernames: interlocutors },
  });

  React.useEffect(() => {
    if (data && data.getUserStatuses) {
      data.getUserStatuses.forEach((statusObj) => {
        if (statusObj.onlineStatus) {
          if (statusObj.username !== username) {
            dispatch(interlocutorIsOnline(statusObj.username));
          }
        }
      });
    }
  }, [data, dispatch, username]);

  return (
    <div>
      <ConversationHeader
        onlineFriends={onlineFriends}
        interlocutors={interlocutors}
        username={username}
      />
      <div className="parent-container">
        <ConversationMessages messages={messages} />
      </div>
      <SendMessageItem />
    </div>
  );
};

export default Conversation;
