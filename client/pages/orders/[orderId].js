import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, currentUser }) => {

  const [timeLeft, setTimeLeft] = useState(0);
  
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
        <div>Item is no longer reserved.</div>
      </div>
    );
  }

  return (
    <div>
      <h1>Order Details</h1>
      <div>
        Item is reserved. {timeLeft} seconds left to checkout.
        <StripeCheckout 
          token={(token) => console.log(token)}
          stripeKey="pk_test_51R6sbk4JmgAK3URjxT1FcGkdWb7YMcrQS489UCBuPgX6VW30RvLX5JNjKBrCE1zMSv0NkqsPVzN9lT2URfErw4OD00uBPU00Ky"
          amount={order.price * 100} // Stripe expects the amount smallest currency unit
          email={currentUser.email} 
        />
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
