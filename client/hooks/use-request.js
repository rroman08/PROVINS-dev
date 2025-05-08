import axios from 'axios';
import { useState } from 'react';

// This hook is used to make HTTP requests
// Hook takes in a URL, HTTP method, request body, and an optional success callback
// It returns a function to make the request and any errors that occur
const UseRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  // doRequest fn is used to make the request
  const doRequest = async (props = {}) => {
    try {
      // It sets the errors to null before making the request
      setErrors(null);
      const response = await axios[method](
        url, 
        {...body, ...props}, // Spread operator to merge body and props
      );
      // If request is successful and callback was passed, onSuccess callback is called
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      // If error occurs, list out errors to be displayed to user
      setErrors(
        <div className="alert alert-danger">
          <h4>Oh no! Something went wrong...</h4>
          <ul className="my-0">
            {error.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default UseRequest;
