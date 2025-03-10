import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    // On the server -> Requests should be made to http://SERVICENAME.NAMESPACE.svc.cluster.local
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      { 
        headers: req.headers,
      }
    ).catch((err) => {
      console.log(err.message);
    });
    return data;
  } else {
    // On the browser -> requests can be made with a base url of '' (browser prepends correct base url)
    const { data } = await axios.get('/api/users/currentuser').catch((err) => {
      console.log(err.message);
    });
    // response is null in the data field, if the user is not logged in
    return data;
  }
}; 

export default LandingPage;
