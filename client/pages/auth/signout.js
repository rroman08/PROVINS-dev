import { useEffect } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const Signout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')   // redirect to the landing page
  });
  
  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out</div>;
}

export default Signout;
