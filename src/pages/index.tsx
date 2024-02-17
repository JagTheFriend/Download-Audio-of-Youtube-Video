import Head from "next/head";
import { useDebounceValue } from "usehooks-ts";
import { Input } from "~/components/ui/input";

function Header() {
  return (
    <div className="m-2 mb-4 flex w-full flex-col items-center justify-center">
      <h2 className="cursor-pointer border-b-2 text-2xl transition-all hover:border-b-blue-500">
        Download audio of Youtube videos for free
      </h2>
    </div>
  );
}

function InputField() {
  const [songName, setSongName] = useDebounceValue("", 500);
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Input
        type="text"
        placeholder="Enter Song Name"
        className="w-7/12"
        onChange={(e) => setSongName(e.target.value)}
      />
      <SearchButton />
    </div>
  );
}

function SearchButton() {
  return (
    <button className="custom-btn btn-3" type="button">
      <span>Search</span>
    </button>
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
