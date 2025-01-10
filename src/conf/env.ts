let env = process.env.NODE_ENV;
let serverURL;
let directServerUrl;

if (env === 'development') {
  serverURL = '/api';
  directServerUrl = 'http://127.0.0.1:8800';
} else if (env === 'production') {
  serverURL = window.location.origin;
  directServerUrl = window.location.origin;
  // serverURL = 'http://localhost:8082';
}

const Env = { serverURL: serverURL, directServerUrl };

export default Env;
