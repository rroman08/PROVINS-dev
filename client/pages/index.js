import buildClient from '../api/build-client';

// index.js is the Landing Page component
// It shows a message based on whether the user is signed in
// It also fetches the current user data from the server
// It uses getInitialProps to fetch the data
// It receives the current user data as a prop
// It shows a message based on the current user data
// It is exported as the default component and imported in _app.js
// It is rendered in the AppComponent component of _app.js
const LandingPage = ({ currentUser }) => {
  return currentUser ? (<h1>You are signed in</h1>) : (<h1>You are NOT signed in</h1>);
};

LandingPage.getInitialProps = async (context) => {
  // Build an axios client with the context
  const client = buildClient(context);  
  // Make a request to the current user route
  const { data } = await client.get('/api/users/currentuser');  

  return data;
}; 

export default LandingPage;
