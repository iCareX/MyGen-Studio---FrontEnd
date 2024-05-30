import React from "react";
import { createBrowserRouter } from "react-router-dom";

import NewChat from "../components/chat/newChat";
import ChatComponent from "../components/chat/chatComponent";
import App from "../App";
import ErorrPage from "../components/pages/errors/ErrorPage";
import AgentComponent from "../components/chat/agentComponent";
import SignIn from "../components/pages/auth/signin";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      // {
      //   index: true,
      //   element: <NewChat />,
      // },
      // {
      //   path: ":id",
      //   element: <ChatComponent />,
      // },
      {
        path: "ideaAI_fast_assessment",
        element: <AgentComponent />,
      },
      {
        path: "ideaAI_executive_assessment",
        element: <AgentComponent />,
      },
      {
        path: "_development_feedback",
        element: <AgentComponent />,
      },
      {
        path: "control_tower",
        element: <ChatComponent />,
      },
    ],
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "*",
    element: <ErorrPage />,
  },
]);

export default router;
