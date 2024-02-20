import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return;

  const id: string = req.body.songId;
  const fileName: string = req.body.fileName;

  console.log(id);
  console.log(fileName);

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileName.replace(/[^\x00-\x7F]/g, "")}.mp3"`,
  );
  return Promise.resolve(
    ytdl(`https://www.youtube.com/watch?v=${id}`, {
      filter: "audioonly",
      requestOptions: { timeout: 360 },
    }).pipe(res),
  );
}
