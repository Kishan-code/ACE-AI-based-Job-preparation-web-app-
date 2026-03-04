import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/BrowserRouter";
import { ToastContainer } from "react-toastify";
import SplashScreen from "./components/SplashScreen"
import { useDispatch } from "react-redux";
import { checkUserAuthThunk } from "./store/features/user/user.thunk";

const App = () => {

  const dispatch = useDispatch();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([
        dispatch(checkUserAuthThunk()),
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);

      setAppReady(true);
    };

    initializeApp();
  }, []);

  if (!appReady) return <SplashScreen />;

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
      />
    </>
  );
};

export default App;
