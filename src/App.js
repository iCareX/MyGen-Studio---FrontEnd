import "./App.css";
import MainHeader from "./components/layouts/header";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@mantine/core/styles.css";
import MainSidebar from "./components/layouts/sidebar";
import { Flex, useMantineColorScheme } from "@mantine/core";
import { useRecoilValue } from "recoil";
import { userTokenState } from "./components/atoms/userAtoms";
import { useEffect } from "react";

function App() {
  const { colorScheme } = useMantineColorScheme();
  const userToken = useRecoilValue(userTokenState);
  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      navigate("/fast_assessment");
    } else {
      navigate("/login");
    }
  }, [userToken, navigate]);

  return (
    <>
      <div
        className="App h-screen"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <MainHeader />
        <Flex h={"100%"}>
          <MainSidebar />
          <Outlet />
        </Flex>
        {/* <MainFooter /> */}
      </div>
      <ToastContainer
        position="top-right"
        limit={5}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={colorScheme}
      />
    </>
  );
}

export default App;
