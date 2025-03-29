import axios from 'axios';

// This function is used to create an axios instance that can be used 
// to make HTTP requests
// It checks if the code is running on the server or the client
// and sets the base URL accordingly
// On the server, it uses the ingress controller service name
// On the client, it uses the browser's base URL
// The 'req' parameter is the request object from the server
// The 'req' parameter is used to set the headers for the request
const BuildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // On the server -> requests should be made to http://SERVICENAME.NAMESPACE.svc.cluster.local
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  }
  else {
    // On the browser -> requests can be made with a base url of '' (browser prepends correct base url)
    return axios.create({
      baseURL: '/',
    });
  }
};

export default BuildClient;
