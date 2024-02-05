import SmallAvatar from "./small-avatar";
import { useEffect, useState } from "react";
import { otherUsersAtom } from "../../atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

export default function OtherUsers({ currUserId }) {
  const navigate = useNavigate();
  const setOtherUsersState = useSetRecoilState(otherUsersAtom);
  const otherUsersValue = useRecoilValue(otherUsersAtom);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const otherUsers = data.users.filter((user) => user._id !== currUserId);
        setOtherUsersState(otherUsers);
      });
  }, [filter, currUserId]);

  return (
    <div>
      <div>
        <input
          type="search"
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          className=" mt-1 block w-full rounded-md border border-slate-300 px-3 py-3 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
        ></input>
      </div>
      <div className="flex flex-col gap-y-4 pt-2">
        {otherUsersValue.map((user) => {
          return (
            <div key={user._id} className="flex flex-row justify-between">
              <div className="flex flex-row items-center gap-4">
                <SmallAvatar text={user.firstName[0] + user.lastName[0]} />
                <div className="font-bold">
                  {user.firstName + " " + user.lastName}
                </div>
              </div>
              <div>
                <button
                  onClick={() =>
                    navigate("/send?id=" + user._id + "&name=" + user.firstName)
                  }
                  className="rounded-md bg-black px-3 py-2 text-xs text-white"
                >
                  Send Money
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
