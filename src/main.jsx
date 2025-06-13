// import { ClerkProvider } from '@clerk/clerk-react';
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// import { UserProvider } from './UserContext';


// if (!PUBLISHABLE_KEY) {
//   throw new Error('Missing Clerk Publishable Key');
// }

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <UserProvider>
//   <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
//     <App />
//   </ClerkProvider>
//   </UserProvider>
// );

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// index.js or App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './UserContext'; // Adjust path as needed
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <UserProvider>
    <App />
  </UserProvider>
  </GoogleOAuthProvider>
);
