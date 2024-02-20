import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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

function CardImage({ thumbnailLink }: { thumbnailLink: string }) {
  return (
    <Image
      className="w-full rounded-t-lg"
      src={thumbnailLink}
      alt="Thumbnail"
      width={999}
      height={999}
    />
  );
}

function CardTitle({ title }: { title: string }) {
  return (
    <h5 className="mb-2 cursor-default text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      {title}
    </h5>
  );
}

function CardDescription({ description }: { description: string }) {
  return (
    <p className="mb-3 cursor-default font-normal text-gray-700 dark:text-gray-400">
      {description}
    </p>
  );
}

function DisplayResults({ data }: { data: DataToSend[] }) {
  const [selectedVid, setSelectedVid] = useState({ songId: "", fileName: "" });

  useEffect(() => {
    if (selectedVid.songId.length === 0) return;
    axios
      .post("/api/yt", {
        songId: selectedVid.songId,
        fileName: selectedVid.fileName,
      })
      .then((response) => {
        const binaryData = [];
        binaryData.push(response.data);

        // create file link in browser's memory
        const href = URL.createObjectURL(
          new Blob(binaryData, { type: "audio/mp3" }),
        );

        let fileName = "music.mp3";
        const contentDisposition = response.headers["content-disposition"];

        if (contentDisposition) {
          // Filename sent by server
          const receivedFileName = contentDisposition.match(/filename="(.+)"/);
          if (receivedFileName.length === 2) {
            fileName = receivedFileName[1];
          }
        }

        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", `${fileName}`);
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      });
  }, [selectedVid]);

  if (data.length === 0) return null;

  const chunkSize = 3;
  const chunkedData = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    chunkedData.push(chunk);
  }

  return (
    <div className="flex flex-col items-center">
      {chunkedData.map((chunk) => {
        return (
          <div key={`${Math.random()}`} className="m-1 flex flex-row gap-2">
            {chunk.map((data) => {
              return (
                <div
                  key={`${Math.random()}`}
                  className={`
                  flex max-w-sm transform flex-col rounded-lg border
                  border-gray-200 bg-white
                  `}
                >
                  <CardImage thumbnailLink={data.thumbnailLink} />
                  <div className="p-5">
                    <CardTitle title={data.title} />
                    <CardDescription description={data.description} />
                    <div className="mt-2 flex flex-col gap-4">
                      <Button
                        variant={"outline"}
                        className="inline-flex items-center rounded-lg"
                        asChild
                      >
                        <Link
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
                        </Link>
                      </Button>
                      <Button
                        variant={"outline"}
                        className="inline-flex items-center rounded-lg"
                        onClick={() => {
                          setSelectedVid({
                            songId: data.videoId,
                            fileName: data.title,
                          });
                        }}
                      >
                        Download MP3
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width={24}
                          height={24}
                          role="img"
                          aria-label="download icon"
                        >
                          <path d="M4.75 17.25a.75.75 0 0 1 .75.75v2.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V18a.75.75 0 0 1 1.5 0v2.25A1.75 1.75 0 0 1 18.25 22H5.75A1.75 1.75 0 0 1 4 20.25V18a.75.75 0 0 1 .75-.75Z" />
                          <path d="M5.22 9.97a.749.749 0 0 1 1.06 0l4.97 4.969V2.75a.75.75 0 0 1 1.5 0v12.189l4.97-4.969a.749.749 0 1 1 1.06 1.06l-6.25 6.25a.749.749 0 0 1-1.06 0l-6.25-6.25a.749.749 0 0 1 0-1.06Z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function InputField() {
  const [songName, setSongName] = useDebounceValue("", 500);
  const [responseData, setResponseData] = useState<DataToSend[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const songsQuery = api.yt.searchSong.useQuery(
    { songName },
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false,
    },
  );

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
        <title>Download MP3</title>
        <meta name="description" content="Download MP3 files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-w-screen flex max-h-full min-h-screen max-w-full flex-col">
        <Header />
        <InputField />
      </main>
    </>
  );
}
