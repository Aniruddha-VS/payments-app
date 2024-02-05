import App from "../App";
import { RecoilRoot } from "recoil";

export default function Root() {
  return (
    <>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </>
  );
}
