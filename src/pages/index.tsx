import Head from "next/head";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import LoadingSpinner from "~/components/LoadingSpinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { DataToSend } from "~/lib/type";
import { api } from "~/utils/api";

function Header() {
  return (
    <div className="m-2 mb-4 flex w-full flex-col items-center justify-center">
      <h2 className="cursor-pointer border-b-2 text-2xl transition-all hover:border-b-blue-500">
        Download MP3 files from Youtube
      </h2>
    </div>
  );
}

function DisplayResults({ data }: { data: DataToSend[] }) {
  if (data.length === 0) return null;

  const chunkSize = 3;
  const chunkedData = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    chunkedData.push(chunk);
  }

  return (
    <>
      {chunkedData.map((chunk) => {
        return (
          <div key={`${Math.random()}`} className="m-1 flex flex-row gap-2">
            {chunk.map((data) => {
              return (
                <div
                  key={`${Math.random()}`}
                  className="max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800"
                >
                  <a href="/">
                    <img
                      className="rounded-t-lg"
                      src={data.thumbnailLink}
                      alt="Thumbnail"
                    />
                  </a>
                  <div className="p-5">
                    <a href="/">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {data.title}
                      </h5>
                    </a>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {data.description}
                    </p>
                    <div className="flex flex-col gap-4">
                      <Button
                        variant={"outline"}
                        className="mt-2 inline-flex items-center rounded-lg"
                        asChild
                      >
                        <a
                          href={`https://www.youtube.com/watch?v=${data.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Watch Video
                          <svg
                            className="ms-2 h-3.5 w-3.5 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </a>
                      </Button>
                      <Button
                        variant={"outline"}
                        className="inline-flex items-center rounded-lg"
                      >
                        Download MP3
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function InputField() {
  const [songName, setSongName] = useDebounceValue("", 500);
  const [responseData, setResponseData] = useState<DataToSend[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const songsQuery = api.yt.searchSong.useQuery({ songName });

  useEffect(() => {
    if (songName) {
      songsQuery.refetch();
    }
  }, [songName, songsQuery.refetch]);

  useEffect(() => {
    if (songsQuery.data) {
      setResponseData(songsQuery.data);
    }
  }, [songsQuery.data]);

  useEffect(() => {
    if (songsQuery.error) {
      setIsError(true);
    }
  }, [songsQuery.error]);

  useEffect(() => {
    setIsLoading(songsQuery.isLoading);
  }, [songsQuery.isLoading]);

  return (
    <>
      <div className="mb-4 flex flex-col items-center justify-center gap-2">
        <Input
          type="text"
          placeholder="Enter Song Name"
          className="w-7/12"
          onChange={(e) => setSongName(e.target.value.trim())}
        />
        <button
          disabled={!songName}
          onClick={() => songsQuery.refetch()}
          className="custom-btn btn-3"
          type="button"
        >
          <span>Search</span>
        </button>
      </div>
      <div className="flex cursor-default justify-center gap-4">
        {isLoading && <LoadingSpinner spinnerColor="blue" />}
        {isError && !isLoading && (
          <p className="text-lg text-red-400 transition-all hover:text-red-500">
            Something went wrong
          </p>
        )}
      </div>
      <DisplayResults data={responseData} />
    </>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-w-screen flex max-h-full min-h-screen max-w-full flex-col">
        <Header />
        <InputField />
      </main>
    </>
  );
}
