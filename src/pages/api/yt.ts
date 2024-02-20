import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id: string = req.query.songId as string;
  const fileName: string = req.query.fileName as string;

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileName.replace(/[^\x00-\x7F]/g, "")}.mp3"`,
  );

  Promise.resolve(
    ytdl(`https://www.youtube.com/watch?v=${id}`, {
      filter: "audioonly",
      requestOptions: { timeout: 360 },
    }).pipe(res),
  );
}
