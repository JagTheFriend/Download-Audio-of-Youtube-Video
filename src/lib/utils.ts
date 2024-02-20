import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  videoFinderUrl,
  type DataToSend,
  type ResponseReceived,
  type VideoFormat,
} from "./type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function searchSong(songName: string): Promise<DataToSend[]> {
  const response = await fetch(videoFinderUrl + songName);
  const data: ResponseReceived = (await response.json()) as ResponseReceived;
  const dataToSend: VideoFormat[] = [];

  if (!data.items) return [];

  for (const key of data.items) {
    dataToSend.push({
      nextPageToken: data.nextPageToken,
      videoId: key.id.videoId,
      title: key.snippet.title,
      description: key.snippet.description,
      thumbnailLink: key.snippet.thumbnails.medium.url,
    });
  }
  return dataToSend;
}
