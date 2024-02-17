export const videoFinderUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${process.env.YOUTUBE_API_KEY}&type=video&maxResults=18&q=`;
export const validityCheckUrl = `https://www.googleapis.com/youtube/v3/videos?part=id&key=${process.env.YOUTUBE_API_KEY}&id=`;

export interface VideoFormat {
  nextPageToken: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailLink: string;
}

export interface ResponseReceived {
  nextPageToken: string;
  items: [
    {
      id: { videoId: string };
      snippet: {
        title: string;
        description: string;
        thumbnails: {
          medium: { url: string };
        };
      };
    },
  ];
}

export interface DataToSend {
  nextPageToken: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailLink: string;
}

export interface ValidityCheckOnly {
  kind: string;
  etag: string;
  items: [
    {
      kind?: string;
      etag?: string;
      id?: string;
    },
  ];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}
