import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { UserContext } from "./_app";

export default function Home() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!user.token) {
      router.push("/signin");
    } else {
      setSignedIn(true);
    }
  }, [user, router]);

  if (!signedIn)
    return (
      <Head>
        <title>Polls Management</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    );

  return (
    <div className="text-white">
      <Head>
        <title>Polls Management</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="min-h-screen min-w-screen flex flex-col justify-center">
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 mt-6 rounded w-32 mx-auto"
          onClick={() => router.push(`/create-poll`)}
        >
          + Create Poll
        </button>
      </div>
    </div>
  );
}
