import React from "react";
import { createBrowserRouter } from "react-router-dom";

import NewChat from "../components/chat/newChat";
import ChatComponent from "../components/chat/chatComponent";
import App from "../App";
import ErorrPage from "../components/pages/errors/ErrorPage";
import SignIn from "../components/pages/auth/signin";
import FastAgentComponent from "../components/chat/FastAgentComponent";
import DevelopmentFeedbackAgentComponent from "../components/chat/DevelopmentFeedbackAgentComponent";
import PriorityAgentComponent from "../components/chat/PriorityAgentComponent";
import SignUp from "../components/pages/auth/signup";
import ProfilePage from "../components/pages/profile/Profile";

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
        path: "fast_assessment",
        element: <FastAgentComponent />,
      },
      {
        path: "priority_assessment",
        element: <PriorityAgentComponent />,
      },
      {
        path: "development_feedback",
        element: <DevelopmentFeedbackAgentComponent />,
      },
      {
        path: "control_tower",
        element: <ChatComponent />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <ErorrPage />,
  },
]);

export default router;
