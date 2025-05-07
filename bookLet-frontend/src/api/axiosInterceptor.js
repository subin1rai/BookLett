import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import apiClient from "./axios";

const AxiosInterceptor = ({ children }) => {
  const { setShowSignIn } = useContext(AppContext);

  useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setShowSignIn(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [setShowSignIn]);

  return children;
};

export default AxiosInterceptor;
