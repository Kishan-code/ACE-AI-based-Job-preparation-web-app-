import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// export const setupInterceptors = (store) => {
//   api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response) {
//         const { status, data } = error.response;
//         if (status === 401) {
//           store.getState().user.user = null; // Clear user data from Redux store
//           store.getState().user.isAuthenticated = false; // Clear authentication status
//           window.location.href = "/login";
//         }
//         return Promise.reject(data);
//       }
//       return Promise.reject(error);
//     },
//   );
// };

export default api;
