import Router from 'next/router';

import useRequest from '../../hooks/use-request';

// Wildcard route: this will be rendered for any URL that matches /products/:productId
// The productId will be available in the context object

// ProductShow component to display product details
const ProductShow = ({ product }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      productId: product.id
    },
    // onSuccess redirects to the order details page
    // orderId is passed as a dynamic route parameter
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`), 
    onError: (err) => {
      console.error(err);
      alert('An error occurred while processing your request.');
    }
  });

  return (
    <div>
      <h1>Product Details</h1>
      <h3>Title: {product.title}</h3>
      <h3>Price: £{product.price}</h3>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">I want to purchase</button>
    </div>
  );
}

ProductShow.getInitialProps = async (context, client) => {
  // context.query is an object that contains the wildcard values
  const { productId } = context.query;
  // Fetch the product details using the productId
  const { data } = await client.get(`/api/products/${productId}`).catch((err) => {
    console.log(err.message);
  });

  return { product: data };
};

export default ProductShow;
