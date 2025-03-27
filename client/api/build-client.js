import axios from 'axios';

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
