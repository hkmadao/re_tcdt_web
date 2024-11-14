export const jwtParse = (token: string) => {
  // var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZG1pbl91c2VyX2lkIjoxLCJpYXQiOjE1OTQwODg1NjUsInRva2VuIjoiZmVhM2RiN2U4YzVhOWE3MDNiM2Q5NmJlMjgxNzEwODAwY2I1NmViYiIsImV4cCI6MzE4ODE4NDMzMH0.MCLpD0KZv4uyx0gCYprWDKXwCX546m3Iy0nH74IpAmk";
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const result = JSON.parse(window.atob(base64));
  return result;
};
