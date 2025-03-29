import axios from 'axios';
import { useState } from 'react';

// This hook is used to make HTTP requests
// It takes in a URL, HTTP method, request body, and an optional success callback
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
      // If the request is successful, it calls the onSuccess callback
      // and passes the response data to it
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      // It catches any errors that occur during the request
      // and sets the errors state to an alert with the error messages
      // It maps over the error messages and displays them in a list
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
