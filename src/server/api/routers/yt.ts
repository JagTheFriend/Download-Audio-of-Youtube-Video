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
});
