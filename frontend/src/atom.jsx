import { atom } from "recoil";
export const isAuthenticatedAtom = atom({
  key: "isAuthenticatedAtom",
  default: false,
});

export const authTokenAtom = atom({
  key: "authToken",
  default: "",
});

export const userAtom = atom({
  key: "userAtom",
  default: {
    username: "",
    firstName: "",
    lastName: "",
    balance: 0,
  },
});

export const otherUsersAtom = atom({
  key: "otherUsersAtom",
  default: [],
});
