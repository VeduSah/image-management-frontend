import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
    console.log('Auth token set in headers:', token);
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    console.log('Auth token removed from headers');
  }
};

export default setAuthToken;