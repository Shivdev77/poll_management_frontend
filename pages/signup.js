import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

import { UserContext } from "./_app";

export default function SignUp() {
  const router = useRouter();

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user.token) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (event.target.password.value !== event.target.confirmPassword.value) {
      alert("Password and confirm password should match");
      return;
    }

    const data = {
      username: event.target.email.value,
      password: event.target.password.value,
      name: event.target.name.value,
    };

    const jsonData = JSON.stringify(data);

    const endpoint = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/signup";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    };

    await fetch(endpoint, options)
      .then((response) => {
        if (response.status === 200) return response.text();
        if (response.status === 409) {
          alert("Account with given email already exists");
        }
        throw response.statusText;
      })
      .then(() => {
        router.push("/signin");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-center">
      <Head>
        <title>Sign up</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col">
        <h2 className="text-white text-center text-xl font-bold">
          Create an account
        </h2>
        <h4 className="text-gray-500 text-center mb-4">
          Or{" "}
          <Link
            className="underline text-sky-500 hover:text-sky-600"
            href="/signin"
          >
            sign in to your account
          </Link>
        </h4>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col m-auto p-4 bg-gray-800 rounded border-t-4  border-blue-500"
        >
          <label htmlFor="name" className="text-white text-sm mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={3}
            className="rounded p-2 bg-gray-700 text-white"
          />

          <label htmlFor="email" className="text-white text-sm mb-1 mt-4">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="rounded p-2 bg-gray-700 text-white"
          />
          <label htmlFor="password" className="text-white text-sm mb-1 mt-4">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minLength={8}
            className="rounded p-2 bg-gray-700 text-white"
          />

          <label
            htmlFor="confirmPassword"
            className="text-white text-sm mb-1 mt-4"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            minLength={8}
            className="rounded p-2 bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white p-2 mt-6 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
