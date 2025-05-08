import axios from 'axios';

// This function is used to create an axios instance that can be used 
// to make HTTP requests
// It checks if the code is running on the server or the client
// and sets the base URL accordingly
const BuildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // On server -> requests should be made to http://SERVICENAME.NAMESPACE.svc.cluster.local
    // use ingress controller service name
    return axios.create({
      baseURL: 'http://www.provins-app-final-project.xyz',
      headers: req.headers,
    });
  }
  else {
    // On browser -> requests can be made with a base url of '' (browser add correct base url)
    return axios.create({
      baseURL: '/',
    });
  }
};

export default BuildClient;
