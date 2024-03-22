//export const BASE_API_URL = "https://handycraft-415122.oa.r.appspot.com";
//export const BASE_API_URL = "http://localhost:8080";
export const BASE_API_URL = (process.env.NODE_ENV === 'development') ? "http://localhost:8080" : ""; // This is the default value for production
export const GITHUB_CLIENT_ID = (process.env.NODE_ENV === 'development') ? "50ec42e42f1a47904fbf" : "b1e5e5404f5c20d849ae";

// export const LOCALHOST_API_URL = "http://localhost:5173";

