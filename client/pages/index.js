import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async (context) => {
  // build an axios client with the context
  const client = buildClient(context);  
  // make a request to the current user route
  const { data } = await client.get("/api/users/currentuser");  
  
  return data;
}; 

export default LandingPage;
