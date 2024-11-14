let env = process.env.NODE_ENV;
let serverURL;

if (env === 'development') {
  serverURL = 'http://127.0.0.1:8800';
} else if (env === 'production') {
  serverURL = window.location.origin;
  // serverURL = 'http://localhost:8082';
}

const Env = { serverURL: serverURL };

export default Env;
