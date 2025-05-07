import { useEffect } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

// Signout component for user authentication
const Signout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    // redirect to the landing page after successful sign out
    onSuccess: () => Router.push('/')
  });
  
  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out</div>;
}

export default Signout;
