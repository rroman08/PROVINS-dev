import { useState } from 'react';

const NewProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  return (
  <div>
    <h1>Add a New Product</h1>
    <form>
      <div className="form-group">
        <label>Product Title</label>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          type="text" 
          className="form-control" />
      </div>
      <div className="form-group">
        <label>Asking Price</label>
        <input 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          type="text" 
          className="form-control" />
      </div>
      <button className="btn btn-primary">List Item</button>
    </form>
  </div>
  );
};

export default NewProduct;
