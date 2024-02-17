import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

function sendResponse(id: string, res: NextApiResponse) {
  return Promise.resolve(
    ytdl(`https://www.youtube.com/watch?v=${id}`, {
      filter: "audioonly",
      requestOptions: { timeout: 360 },
    }).pipe(res),
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id: string = req.query.id as string;
  const fileName: string = req.query.fileName as string;

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${
      // biome-ignore lint/suspicious/noControlCharactersInRegex: Allow regex to remove illegal characters
      fileName.replace(/[^\x00-\x7F]/g, "")
    }.mp3"`,
  );
  sendResponse(id, res);
}
