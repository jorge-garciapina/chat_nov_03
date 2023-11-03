INSTRUCTIONS:
1) TO RUN THE SERVERS 
BACKEND: 
TO START THE SERVERS, USE: 
///////////////////////////////////////
AUTH SERVICE:
$env:AUTH_CONNECTION="mongodb://127.0.0.1:27017/auth"
$env:JWT_SECRET="secret"
npm run start-auth-service


///////////////////////////////////////
CONVERSATION SERVICE: 
$env:CONVERSATION_CONNECTION="mongodb://127.0.0.1:27017/conversation"
npm run start-conversation-service

///////////////////////////////////////
USER SERVICE:
$env:USER_CONNECTION="mongodb://127.0.0.1:27017/user"
npm run start-user-service

//////////////////////////////////////////////////
GRAPHQL SERVER:
$env:AUTH_SERVICE_CONNECTION="http://127.0.0.1:3001/auth"
$env:USER_SERVICE_CONNECTION="http://127.0.0.1:3002/user" 
$env:CONVERSATION_SERVICE_CONNECTION="http://127.0.0.1:3003/conversation"  
npm run start-apollo-server


FRONTEND: 
ONLY GO TO chat-app/frontend AND SEND THE COMMAND: 
npm start


