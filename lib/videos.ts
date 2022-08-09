import videoTestData from "../data/videos.json";
import { getLikedVideos, getWatchedVideos } from "./db/hasura";

interface responseData {
  items: {
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      channelTitle: string;
      thumbnails: { high: { url: string } };
    };
    id: { videoId: string };
    statistics: { viewCount: number };
  }[];
  error?: {
    [key: string]: string;
  };
}

const fetchVideos = async (url: string) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
  const BASE_URL = "youtube.googleapis.com/youtube/v3";

  const response = await fetch(
    `https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
  );

  return (await response.json()) as responseData;
};

const getCommonVideos = async (url: string) => {
  try {
    const isDev = process.env.DEVELOPMENT!;
    const data = isDev === "true" ? videoTestData : await fetchVideos(url);

    if (data?.error) {
      console.error("Youtube API error", data.error);
      return [];
    }

    return data.items.map((item) => {
      const id = item.id?.videoId || item.id;

      const snippet = item.snippet;
      return {
        title: snippet.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        id,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    console.error("Something went wrong with videos library", error);
    return [];
  }
};

export const getVideos = (searchQuery: string) => {
  const URL = `search?part=snippet&q=${searchQuery}&type=video`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US";

  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId: string) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (
  userId: string,
  token: string | null | undefined
) => {
  const videos = await getWatchedVideos(userId, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    };
  });
};

export const getFavouritedVideos = async (
  userId: string,
  token: string | null | undefined
) => {
  const videos = await getLikedVideos(userId, token);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    };
  });
};
