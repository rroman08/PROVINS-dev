import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Link from 'next/link';

import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {

  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/orders/confirm',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: (payment) => console.log(payment),
  });
  
  useEffect(() => {
    const getTimeLeft = () => {
      const millisecondsLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(millisecondsLeft / 1000));  // Convert to seconds
    };

    getTimeLeft();  // Initial call to set the time left immediately
    const currentTimeId = setInterval(getTimeLeft, 1000);  // Update every second
    // Need to shutdown the interval
    return () => {
      clearInterval(currentTimeId);
    }
  }, [order]);

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

  // Fetch order details using the orderId
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
