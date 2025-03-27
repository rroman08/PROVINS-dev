// Wildcard route: this will be rendered for any URL that matches /products/:productId
// The productId will be available in the context object

const ProductShow = ({ product }) => {
  return (
    <div>
      <h1>Product Details</h1>
      <h3>Title: {product.title}</h3>
      <h3>Price: £{product.price}</h3>
      <button className="btn btn-primary">I want to purchase</button>
    </div>
  );
}

ProductShow.getInitialProps = async (context, client) => {
  // context.query is an object that contains the wildcard values
  const { productId } = context.query;
  const { data } = await client.get(`/api/products/${productId}`);

  return { product: data };
};

export default ProductShow;
