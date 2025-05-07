import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { BrowserRouter } from "react-router-dom";
import AxiosInterceptor from "./api/axiosInterceptor.js";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <AxiosInterceptor>
        <App />
      </AxiosInterceptor>
    </AppContextProvider>
  </BrowserRouter>
);
