import Link from 'next/link';

// index.js is the Landing Page component
// It shows a message based on whether the user is signed in
// It is exported as the default component and imported in _app.js
// It is rendered in the AppComponent component of _app.js
const LandingPage = ({ currentUser, products }) => {
  // console.log(products);
  // return currentUser ? (<h1>You are signed in</h1>) : (<h1>You are NOT signed in</h1>);
  const productList = products.map(product => {
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
      <h1>Products on Offer</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Want to Purchase</th>
          </tr>
        </thead>
        <tbody>
          {productList}
        </tbody>
      </table>
    </div>
  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // De-structure res into item that is wanted from the response object (data)
  const { data } = await client.get('/api/products');
  // Merges into the props object that are being passed to the LandingPage component
  return { products: data };
}; 

export default LandingPage;
