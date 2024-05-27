import "./App.css";
import MainHeader from "./components/layouts/header";
import MainFooter from "./components/layouts/footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@mantine/core/styles.css";
import MainSidebar from "./components/layouts/sidebar";
import { Flex, useMantineColorScheme } from "@mantine/core";

function App() {
  const { colorScheme } = useMantineColorScheme();
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
