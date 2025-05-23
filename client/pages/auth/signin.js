import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

// Signin component for user authentication
const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    // Redirect to the landing page after successful sign in
    onSuccess: () => Router.push('/')
  });

  // onSubmit function is called when the form is submitted
  const onSubmit = async event => {
    // Prevent the default form submission behaviour, that is, refreshing the page
    // and call the doRequest function to make the API request
    event.preventDefault();
    doRequest();
  };

  return <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          type="password" 
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
    </form>
}

export default Signin;
