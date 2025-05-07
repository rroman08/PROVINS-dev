import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Link from 'next/link';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

// Wildcard route: this will be rendered for any URL that matches /orders/:orderId
// The orderId will be available in the context object

// OrderShow component to display order details and handle payment
const OrderShow = ({ order, currentUser }) => {
  //
  const [timeLeft, setTimeLeft] = useState(0);  // 0 means no time left
  const { doRequest, errors } = useRequest({
    url: '/api/orders/confirm',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => Router.push('/orders'), // redirect to orders page after successful payment
  });
  
  useEffect(() => {
    // Function to calculate the time left until the order expires
    const getTimeLeft = () => {
      const millisecondsLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(millisecondsLeft / 1000));  // Convert to seconds
    };

    // Initial call to set the time left immediately
    getTimeLeft();
    const currentTimeId = setInterval(getTimeLeft, 1000);  // Updates every second
    // Need to shutdown the interval
    return () => {
      clearInterval(currentTimeId);  // When returning from the page, clear the interval
    }
  }, [order]);

  // If the order has expired, show a message and a link to the product page
  if (timeLeft < 0) { 
    return (
      <div>
        <h1>Order Details</h1>
        <h2>This item is no longer reserved.</h2>
        <p>Do still want it?</p>
        <p>
          <Link href="/products/[productId]" as={`/products/${order.product.id}`}>
            Go here...
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Order Details</h1>
      <h2>Item: {order.product.title}</h2>
      <h3>Price: £{order.product.price}</h3>
      <div>
        Item is reserved. {timeLeft} seconds left to checkout.
        <StripeCheckout 
          token={({ id }) => doRequest({ token: id })}
          stripeKey="pk_test_51R6sbk4JmgAK3URjxT1FcGkdWb7YMcrQS489UCBuPgX6VW30RvLX5JNjKBrCE1zMSv0NkqsPVzN9lT2URfErw4OD00uBPU00Ky"
          amount={order.product.price * 100} // Stripe expects the amount smallest currency unit
          email={currentUser.email} 
          // Use Stripe test card number for testing: 4242 4242 4242 4242 with any CVC and date
        />
        {errors}
      </div>    
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  // Fetch order details for specific proudct using the orderId
  const { data } = await client.get(`/api/orders/${orderId}`).catch((err) => {
    console.log(err.message);
  });

  return { order: data };
};

export default OrderShow;
