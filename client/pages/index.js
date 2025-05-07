import Link from 'next/link';

// index.js is the Landing Page React component
// It shows a message based on whether the user is signed in
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

// This function is called on the server side to fetch data before rendering the page
// It is used to fetch the current user and the list of products
// This route handler is used to get all products that are not reserved
// It is used by the client to display all available products
LandingPage.getInitialProps = async (context, client, currentUser) => {
  // Fetches the list of products from the API
  const { data } = await client.get('/api/products').catch((err) => {
    console.log(err.message);
  });
  // The data is the list of products
  return { products: data };
}; 

export default LandingPage;
