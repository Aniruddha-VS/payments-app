import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SendMoney() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);

  return (
    <div className="flex h-screen justify-center bg-gray-100">
      <div className="flex h-full flex-col justify-center">
        <div className="text-card-foreground h-min w-96 max-w-md space-y-8 rounded-lg border bg-white p-4 shadow-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-center text-3xl font-bold">Send Money</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                <span className="text-2xl text-white">
                  {name[0].toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  for="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                  }}
                  type="number"
                  className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  id="amount"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={async () => {
                  const response = await fetch(
                    "http://localhost:3000/api/v1/account/transfer",
                    {
                      method: "POST",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        to: id,
                        amount,
                      }),
                    },
                  );
                  console.log(response);
                  if (response.status === 200) {
                    navigate("/dashboard");
                  }
                }}
                className="ring-offset-background h-10 w-full justify-center rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
