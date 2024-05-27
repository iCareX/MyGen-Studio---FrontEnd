import React from "react";
import { createBrowserRouter } from "react-router-dom";

import NewChat from "../components/chat/newChat";
import ChatComponent from "../components/chat/chatComponent";
import App from "../App";
import ErorrPage from "../components/pages/errors/ErrorPage";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        index: true,
        element: <NewChat />,
      },
      // {
      //   path: ":id",
      //   element: <ChatComponent />,
      // },
      {
        path: "ideaAI_fast_assessment",
        element: <ChatComponent />,
      },
      {
        path: "ideaAI_executive_assessment",
        element: <ChatComponent />,
      },
      {
        path: "_development_feedback",
        element: <ChatComponent />,
      },
    ],
  },
  {
    path: "*",
    element: <ErorrPage />,
  },
]);

export default router;
