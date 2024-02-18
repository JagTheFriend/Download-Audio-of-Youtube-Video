import ytdl from "ytdl-core";
import { z } from "zod";
import { searchSong } from "~/lib/utils";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ytRouter = createTRPCRouter({
  searchSong: publicProcedure
    .input(z.object({ songName: z.string() }))
    .query(async ({ input }) => {
      if (!input.songName) return;
      const dataToSend = await searchSong(input.songName);
      return dataToSend;
    }),

  downloadAudio: publicProcedure
    .input(z.object({ fileName: z.string(), songId: z.string() }))
    .query(({ input, ctx }) => {
      const id: string = input.songId;
      const fileName: string = input.fileName;

      ctx.res.setHeader(
        "Content-Disposition",
        `attachment; filename="${
          // biome-ignore lint/suspicious/noControlCharactersInRegex: Allow regex to remove illegal characters
          fileName.replace(/[^\x00-\x7F]/g, "")
        }.mp3"`,
      );
      return Promise.resolve(
        ytdl(`https://www.youtube.com/watch?v=${id}`, {
          filter: "audioonly",
          requestOptions: { timeout: 360 },
        }).pipe(ctx.res),
      );
    }),
});
