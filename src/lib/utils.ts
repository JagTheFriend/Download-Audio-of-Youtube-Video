import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  DataToSend,
  ResponseReceived,
  VideoFormat,
  videoFinderUrl,
} from "./type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function searchSong(songName: string): Promise<DataToSend[]> {
  const response = await fetch(videoFinderUrl + songName);
  const data: ResponseReceived = <ResponseReceived>await response.json();
  const dataToSend: VideoFormat[] = [];
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
