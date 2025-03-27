import { useState } from 'react';
import Router from 'next/router';

import userRequest from '../../hooks/use-request';

const NewProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  // Configuring the useRequest hook
  const { doRequest, errors } = userRequest({
    url: '/api/products',
    method: 'post',
    body: {
      title, 
      price
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    // Prevents the form from submitting and refreshing the page
    event.preventDefault();
    await doRequest();
  };

  const onBlur = () => {
    // Converts to float if number string, else returns NaN
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    // Rounds to 2 decimal places
    setPrice(value.toFixed(2));
  };

  return (
  <div>
    <h1>Add a New Product</h1>
    <form onSubmit={onSubmit} >
      <div className="form-group">
        <label>Product Title</label>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          type="text" 
          className="form-control" />
      </div>
      <div className="form-group">
        <label>Asking Price (£)</label>
        <input 
          value={price} 
          // onBlur function is called when the input loses focus, i.e., when user clicks outside the input
          onBlur={onBlur}
          onChange={(e) => setPrice(e.target.value)} 
          type="text" 
          className="form-control" />
      </div>
      {/* Errors are usually empty and only populated when there is an error */}
      {errors}
      <button className="btn btn-primary">List Item</button>
    </form>
  </div>
  );
};

export default NewProduct;
