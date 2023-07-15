import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./_app";

export default function CreatePoll() {
  const router = useRouter();
  const { user, signOut } = useContext(UserContext);

  useEffect(() => {
    if (!user.token) {
      router.push("/signin");
    }
  }, [user, router]);

  const [options, setOptions] = useState([
    { value: "", key: 0 },
    { value: "", key: 1 },
  ]);

  const [startTime, setStartTime] = useState(() => {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    now.setMilliseconds(null);
    now.setSeconds(null);
    return now.toISOString().slice(0, -1);
  });

  const [endTime, setEndTime] = useState(() => {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    now.setMilliseconds(null);
    now.setSeconds(null);
    now.setDate(now.getDate() + 1);
    return now.toISOString().slice(0, -1);
  });

  const addFields = (event) => {
    event.preventDefault();
    setOptions([
      ...options,
      { value: "", key: options[options.length - 1].key + 1 },
    ]);
  };

  const updateOption = (newValue, index) => {
    const newOptions = [...options];
    newOptions[index].value = newValue;
    setOptions(newOptions);
  };

  const removeOption = (event, index) => {
    event.preventDefault();
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const optionValues = options.map((option) => option.value);

    const data = {
      question: title,
      options: optionValues,
      start_time: Date.parse(event.target.startTime.value),
      end_time: Date.parse(event.target.endTime.value),
    };

    const jsonData = JSON.stringify(data);

    const endpoint = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/polls/create";

    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: jsonData,
    };

    await fetch(endpoint, postOptions)
      .then((response) => {
        if (response.status === 200) return response.json();
        if (response.status === 401) {
          signOut();
        }
        throw response.text();
      })
      .then((result) => {
        router.push(`/${result.id}`);
      })
      .catch((error) => {
        error.then((message) => alert(message));
      });
  };

  return (
    <>
      <Head>
        <title>Create a Poll</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="min-h-screen min-w-screen flex flex-col justify-center">
        <div className="flex flex-col mb-4">
          <h2 className="text-white text-center text-2xl font-bold">
            Create a Poll
          </h2>
          <h4 className="text-gray-500 text-center text-sm mb-4">
            Complete the below fields to create your poll
          </h4>
          <form
            className="flex flex-col m-auto p-4 w-full bg-gray-800 rounded border-t-4 border-blue-500"
            onSubmit={handleSubmit}
            style={{ maxWidth: "600px" }}
          >
            <label className="text-white text-sm mb-1" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              className="rounded p-2 bg-gray-700 text-white w-full placeholder:text-gray-500 border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Type your question here"
              id="title"
              name="title"
              required
            ></input>
            <label
              className="text-white mt-4 text-sm mb-1"
              htmlFor={`option${options.length - 1}`}
            >
              Answer Options
            </label>
            <div className="flex flex-col gap-2">
              {options.map((option, index) => (
                <div
                  className="flex items-center rounded p-2 bg-gray-700 border border-gray-700 focus-within:border-blue-500"
                  key={option.key}
                >
                  <input
                    type="text"
                    className="bg-gray-700 flex-1 placeholder:text-gray-500 focus:outline-none focus:border-none text-white"
                    placeholder={`Option ${index + 1}`}
                    value={option.value}
                    name={`option${index}`}
                    id={`option${index}`}
                    onChange={(e) => updateOption(e.target.value, index)}
                    required
                  ></input>
                  {options.length > 1 ? (
                    <button
                      className="text-gray-400"
                      onClick={(e) => removeOption(e, index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <button
              onClick={addFields}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 mt-2 rounded w-36 flex items-center justify-center disabled:opacity-50 disabled:hover:bg-gray-700"
              // disabled={options.length >= 6}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add option
            </button>
            <label htmlFor="startTime" className="text-white mt-4 text-sm mb-1">
              Starting time
            </label>
            <input
              id="startTime"
              type="datetime-local"
              name="startTime"
              className="bg-gray-700 text-white p-2 rounded"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <label htmlFor="endTime" className="text-white mt-4 text-sm mb-1">
              Ending time
            </label>
            <input
              id="endTime"
              type="datetime-local"
              name="endTime"
              className="bg-gray-700 text-white p-2 rounded"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min={startTime}
            />

            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 mt-6 rounded"
            >
              Create poll
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
