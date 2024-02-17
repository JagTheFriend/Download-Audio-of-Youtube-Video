import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ytRouter = createTRPCRouter({
  searchSong: publicProcedure
    .input(z.object({ songName: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const dataToSend = await searchSong(input.songName);
      return dataToSend;
    }),
});
