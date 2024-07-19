import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import router from "./Router/router";
import ChatTitleEditModal from "./components/modals/chat/Edit";
import { ModalsProvider } from "@mantine/modals";
import ChatShareModal from "./components/modals/chat/Share";
import ChatDeleteModal from "./components/modals/chat/Delete";
import { RecoilRoot } from "recoil";
import "@mantine/dropzone/styles.css";

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  autoContrast: true,
  luminanceThreshold: 0.7,
  // colors: {
  //   light: {
  //     body: "#ffffff",
  //   },
  //   dark: {
  //     body: "#000000", // Dark mode body color
  //   },
  // },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <ModalsProvider
          modals={{
            chatTitleEdit: ChatTitleEditModal,
            chatShare: ChatShareModal,
            chatDelete: ChatDeleteModal,
          }}
        >
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </ModalsProvider>
      </MantineProvider>
    </RecoilRoot>
  </React.StrictMode>
);
