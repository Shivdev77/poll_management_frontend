import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

import { UserContext } from "./_app";

export default function SignIn() {
  const router = useRouter();
  const { user, signIn } = useContext(UserContext);

  useEffect(() => {
    if (user.token) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      username: event.target.email.value,
      password: event.target.password.value,
    };

    const jsonData = JSON.stringify(data);

    const endpoint = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/signin";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    };

    await fetch(endpoint, options)
      .then((response) => {
        if (response.status === 200) return response.json();
        if (response.status === 401) {
          alert("Incorrect email-password combination");
        }
        throw response.statusText;
      })
      .then((result) => {
        signIn(result.access_token);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-center">
      <Head>
        <title>Sign in</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col">
        <h2 className="text-white text-center text-xl font-bold">
          Sign in to your account
        </h2>
        <h4 className="text-gray-500 text-center mb-4">
          Or{" "}
          <Link
            href="/signup"
            className="underline text-sky-500 hover:text-sky-600"
          >
            create an account
          </Link>
        </h4>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col m-auto p-4 bg-gray-800 rounded border-t-4 border-blue-500"
        >
          <label htmlFor="email" className="text-white text-sm mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="rounded p-2 bg-gray-700 text-white"
          />

          <label htmlFor="password" className="text-white text-sm mt-4 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="rounded p-2 bg-gray-700 text-white"
            minLength={8}
          />

          <button
            type="submit"
            className="bg-indigo-500 text-white p-2 mt-6 rounded"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
