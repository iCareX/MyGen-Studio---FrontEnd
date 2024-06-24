import { atom } from "recoil";

const userDataState = atom({
  key: "user-data",
  default: JSON.parse(localStorage.getItem("mygen_auth")) || "",
});

const userTokenState = atom({
  key: "user-token",
  default: JSON.parse(localStorage.getItem("mygen_token")) || "",
});

export { userTokenState, userDataState };
