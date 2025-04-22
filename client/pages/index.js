import Link from 'next/link';

// index.js is the Landing Page React component
// It shows a message based on whether the user is signed in
// It is exported as the default component and imported in _app.js
// It is rendered in the AppComponent component of _app.js
const LandingPage = ({ currentUser, products }) => {
  const productList = products.map((product) => {
    return (
      <tr key={product.id}>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>
          <Link href="/products/[productId]" as={`/products/${product.id}`}>
            See Details...
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Products Offered</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Want to Purchase</th>
          </tr>
        </thead>
        <tbody>{productList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // Fetches the list of products from the API
  // The client is the axios instance created in _app.js
  // The context is the Next.js context object
  const { data } = await client.get('/api/products').catch((err) => {
    console.log(err.message);
  });
  // The data is the list of products
  return { products: data };
}; 

export default LandingPage;
