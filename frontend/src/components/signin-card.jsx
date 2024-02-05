import { z } from "zod";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState } from "react";

const signinSchema = z.object({
  username: z.string().email().min(3).max(30),
  password: z.string().min(6),
});

export default function SignInCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSignin(event) {
    event.preventDefault();

    const formBody = {
      username: email,
      password: password,
    };

    const signinValidation = signinSchema.safeParse(formBody).success;

    if (signinValidation) {
      console.log("sending post req");
      const response = await fetch("http://localhost:3000/api/v1/user/signin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formBody),
      });

      const data = await response.json();

      console.log(data);

      if (data.ok) {
        setRedirectToDashboard(true);
      } else {
        console.log("Caught");
        setErrorMsg("Incorrect Username / Password");
        setShowError(true);
      }
    } else {
      setShowError(true);
      setErrorMsg("Input Validation Failed.");
    }
  }

  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="mx-auto flex w-[90%] flex-none flex-col gap-4 rounded bg-white p-4 md:w-[400px] ">
      <div className="text-center">
        <div className="text-2xl font-bold"> Sign In </div>
        <div className="text-md font-light">Enter your Sign In Information</div>
      </div>
      <form onSubmit={handleSignin} className="flex flex-col gap-4">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 after:ml-0.5 after:text-red-500 after:content-['*']">
            Email
          </span>
          <input
            type="email"
            name="email"
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 after:ml-0.5 after:text-red-500 after:content-['*']">
            Password
          </span>
          <input
            type="password"
            name="password"
            className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <input
            type="submit"
            value="Sign In"
            className="mt-1 block w-full rounded-md border border-slate-300 bg-black px-3 py-3 text-white placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
          ></input>
        </div>
        <div className="text-center">
          {" "}
          Don't have an account?{" "}
          <Link to="/signup" className="underline underline-offset-2">
            Sign Up
          </Link>
        </div>
        {showError && <ValidationFailed err={errorMsg} />}
      </form>
    </div>
  );
}

function ValidationFailed({ err }) {
  return (
    <div>
      <label className="flex flex-col gap-2">
        <span className="block text-center text-sm font-medium text-red-500">
          {err}
        </span>
      </label>
    </div>
  );
}
