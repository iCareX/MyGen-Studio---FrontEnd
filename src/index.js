import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider, createTheme } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import router from "./Router/router";
import ChatTitleEditModal from "./components/modals/chat/Edit";
import { ModalsProvider } from "@mantine/modals";
import ChatShareModal from "./components/modals/chat/Share";
import ChatDeleteModal from "./components/modals/chat/Delete";

const root = ReactDOM.createRoot(document.getElementById("root"));

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

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
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
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
