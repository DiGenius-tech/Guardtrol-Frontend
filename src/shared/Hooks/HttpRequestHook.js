import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from '../Context/AuthContext';

const useHttpRequest = () => {
  const auth = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const sendRequest = async (url, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true);
    setError(null);
    setResponseData(null)
    try {
      const response = await fetch(url, {
        method,
        body: body ? body : null,
        headers: {
          
          
      
          ...headers,
        },
        mode: 'cors'
      });
      const data = await response.json();
      if (!response.ok) {
       return setError(data.message || 'Something went wrong!');
        
      }

      
       setIsLoading(false);
        setResponseData(data);
       
       return data
    } catch (err) {
      return setError(err.message || 'Something went wrong!');
    }
    
  };

  return { isLoading, error, responseData, sendRequest };
};

export default useHttpRequest;
