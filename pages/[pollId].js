import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProgressBar from "../components/progressBar";

export default function Poll(props) {
  const [voted, setVoted] = useState(() =>
    typeof localStorage != "undefined" ? localStorage.getItem(props.id) : null
  );
  const [votes, setVotes] = useState(null);
  const [isLive, setIsLive] = useState(null);

  const totalVotes = useMemo(() => {
    if (votes) return votes.reduce((partialSum, a) => partialSum + a, 0);
    return null;
  }, [votes]);

  const votesPercentage = useMemo(() => {
    if (votes && totalVotes) {
      return votes.map((vote) => Math.round((vote / totalVotes) * 10000) / 100);
    }
    return null;
  }, [votes, totalVotes]);

  const progressBarColors = useMemo(
    () => ["#3eb991", "#ff7563", "#aa66cc", "#ffbb33", "#ff8800"],
    []
  );

  const connect = useCallback(() => {
    let timeout = 250;

    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_BASE_URL + "/votes/" + props.id
    );

    ws.onopen = function () {
      timeout = 250;
      const ping = () => {
        if (!ws) return;
        if (ws.readyState !== 1) return;
        ws.send("ping");
        setTimeout(ping, 20000);
      };
      ping();
    };

    ws.onmessage = function (e) {
      if (e.data !== "pong") {
        setVotes(JSON.parse(e.data));
      }
      setIsLive(true);
    };

    ws.onclose = function (e) {
      setIsLive(false);
      setTimeout(connect, Math.min(10000, (timeout += timeout)));
    };

    ws.onerror = function (err) {
      setIsLive(false);
      ws.close();
    };
  }, [props.id]);

  useEffect(() => {
    if (voted) {
      connect();
    }
  }, [voted, connect]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (voted == null) {
      const option = event.target.option.value;

      const requestOptions = {
        method: "POST",
        redirect: "follow",
      };

      fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          `/votes/${props.id}/${option}`,
        requestOptions
      )
        .then((response) => {
          if (response.status === 200) {
            setVoted(option);
            localStorage.setItem(props.id, option);
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  return (
    <>
      <Head>
        <title>{`Poll - ${props.question}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="min-h-screen min-w-screen flex flex-col justify-center">
        <div className="flex flex-col mb-4">
          <h1 className="text-white text-center text-2xl font-bold mb-4">
            Live Voting
          </h1>
          {voted && votes ? (
            <div
              className="flex flex-col m-auto p-4 w-full bg-gray-800 rounded border-t-4 border-blue-500"
              style={{ maxWidth: "600px" }}
            >
              <h2 className="text-white text-xl mb-4">{props.question}</h2>
              <div className="flex flex-col gap-2">
                {props.options.map((option, index) => (
                  <div key={index}>
                    <div className="flex mb-1 mt-2">
                      <span className="flex-1 mr-4 text-gray-100">
                        {option}
                      </span>
                      <span className="text-gray-400">
                        {votesPercentage[index]}% ({votes[index]} votes)
                      </span>
                    </div>
                    <ProgressBar
                      bgcolor={
                        progressBarColors[index % progressBarColors.length]
                      }
                      progress={votesPercentage[index]}
                      height={20}
                    />
                  </div>
                ))}
                <span className="text-gray-400 mt-2">
                  You voted - {props.options[voted]}
                </span>
                <div className="border border-t-1 border-gray-600 my-2"></div>
                <div className="flex text-gray-400">
                  <span className="flex-1 mr-4">{totalVotes} votes</span>
                  <span className="flex">
                    {isLive ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l8.735 8.735m0 0a.374.374 0 11.53.53m-.53-.53l.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 010 5.304m2.121-7.425a6.75 6.75 0 010 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 01-1.06-2.122m-1.061 4.243a6.75 6.75 0 01-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12z"
                        />
                      </svg>
                    )}
                    {isLive ? "Live" : "Not Live"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <form
              className="flex flex-col m-auto p-4 w-full bg-gray-800 rounded border-t-4 border-blue-500"
              style={{ maxWidth: "600px" }}
              onSubmit={handleSubmit}
            >
              <h2 className="text-white text-xl mb-4">{props.question}</h2>
              <label className="text-gray-400 mb-2" htmlFor="option">
                Make a choice:
              </label>
              <div className="flex flex-col gap-2">
                {props.options.map((option, index) => (
                  <div className="flex" key={index}>
                    <input
                      type="radio"
                      id={option}
                      name="option"
                      value={index}
                      className="mr-2 cursor-pointer"
                      required
                    ></input>
                    <label
                      className="text-gray-100 cursor-pointer"
                      htmlFor={option}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="bg-indigo-500 text-white p-2 mt-6 rounded"
              >
                Vote
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { pollId } = context.query;

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return await fetch(
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/polls/${pollId}`,
    requestOptions
  )
    .then((response) => {
      if (response.status === 200) return response.json();
      throw response.status;
    })
    .then((result) => {
      return {
        props: { ...result },
      };
    })
    .catch(() => {
      return {
        notFound: true,
      };
    });
}
