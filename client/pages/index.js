// index.js is the Landing Page component
// It shows a message based on whether the user is signed in
// It is exported as the default component and imported in _app.js
// It is rendered in the AppComponent component of _app.js
const LandingPage = ({ currentUser }) => {
  return currentUser ? (<h1>You are signed in</h1>) : (<h1>You are NOT signed in</h1>);
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
}; 

export default LandingPage;
