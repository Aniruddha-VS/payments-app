import { useEffect } from "react";
import MainAvatar from "../components/dashboard/main-avatar";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../atom";
import { useNavigate } from "react-router-dom";
import OtherUsers from "../components/dashboard/other-users";

export default function Dashbaord() {
  const user = useRecoilValue(userAtom);
  const setUserState = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  async function handleLogOut() {
    console.log("logout");
    try {
      const response = await fetch("http://localhost:3000/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/signin");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(
          "http://localhost:3000/api/v1/user/userdata",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        console.log(userResponse.status);

        if (userResponse.status === 403) {
          navigate("/signin");
          return;
        }

        const currUserdata = await userResponse.json();

        setUserState((prev) => {
          return {
            ...prev,
            id: currUserdata._id,
            firstName: currUserdata.firstName,
            lastName: currUserdata.lastName,
            username: currUserdata.username,
            balance: currUserdata.balance,
          };
        });
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-y-4 px-8 py-4">
        <div className="flex flex-row items-center  justify-between border-b pb-4">
          <div className="text-2xl font-extrabold">Payments App</div>
          <div className="flex flex-row items-center gap-4">
            <button
              onClick={handleLogOut}
              className="text-md rounded-lg bg-black  px-4 py-2  text-white"
            >
              Logout
            </button>
            <div className="flex flex-row items-center gap-2">
              <div> Hello, {user.firstName}</div>
              <MainAvatar text={user.firstName[0] + user.lastName[0] || ""} />
            </div>
          </div>
        </div>
        <div className="text-xl font-bold ">
          Your Balance: &#8377; {user.balance}
        </div>
        <div className="text-xl font-bold">
          {user.firstName + " " + user.lastName}
        </div>
        <OtherUsers currUserId={user.id} />
      </div>
    </div>
  );
}
