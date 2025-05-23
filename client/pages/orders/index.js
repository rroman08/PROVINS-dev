// OrderIndex component to display a list of orders
const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map(order => {
       return (
       <li key={order.id}>
          {order.product.title} - {order.status}
        </li>
       )
      })}
    </ul>
  );
}

OrderIndex.getInitialProps = async (context, client) => {
  // Fetch all orders for the current user
  const { data } = await client.get('/api/orders').catch((err) => {
    console.log(err.message);
  });
  
  return { orders: data };
}

export default OrderIndex;
