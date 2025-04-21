const API_KEY = "b391b73aa843dcbc939acbf193559e13";
const API_URL = "https://ws.audioscrobbler.com/2.0/";

export interface LastFmArtist {
  name: string;
  mbid: string;
  url: string;
  image: Array<{
    "#text": string;
    size: string;
  }>;
}

export interface LastFmTrack {
  name: string;
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  url: string;
  mbid: string;
  image: Array<{
    "#text": string;
    size: string;
  }>;
}

export interface LastFmAlbum {
  name: string;
  artist: string;
  url: string;
  image: Array<{
    "#text": string;
    size: string;
  }>;
  mbid: string;
}

// Get recommendations based on a tag
export const getRecommendationsByTag = async (
  tag: string = "pop",
  limit: number = 10
) => {
  try {
    const response = await fetch(
      `${API_URL}?method=tag.gettoptracks&tag=${tag}&api_key=${API_KEY}&format=json&limit=${limit}`
    );
    const data = await response.json();
    return data.tracks.track as LastFmTrack[];
  } catch (error) {
    console.error("Error fetching Last.fm recommendations by tag:", error);
    return [];
  }
};

// Get top tracks by an artist
export const getTracksByArtist = async (artist: string, limit: number = 10) => {
  try {
    const response = await fetch(
      `${API_URL}?method=artist.gettoptracks&artist=${encodeURIComponent(
        artist
      )}&api_key=${API_KEY}&format=json&limit=${limit}`
    );
    const data = await response.json();
    return data.toptracks.track as LastFmTrack[];
  } catch (error) {
    console.error("Error fetching Last.fm tracks by artist:", error);
    return [];
  }
};

// Get similar artists
export const getSimilarArtists = async (artist: string, limit: number = 10) => {
  try {
    const response = await fetch(
      `${API_URL}?method=artist.getsimilar&artist=${encodeURIComponent(
        artist
      )}&api_key=${API_KEY}&format=json&limit=${limit}`
    );
    const data = await response.json();
    return data.similarartists.artist as LastFmArtist[];
  } catch (error) {
    console.error("Error fetching Last.fm similar artists:", error);
    return [];
  }
};

// Get track info
export const getTrackInfo = async (track: string, artist: string) => {
  try {
    const response = await fetch(
      `${API_URL}?method=track.getInfo&track=${encodeURIComponent(
        track
      )}&artist=${encodeURIComponent(artist)}&api_key=${API_KEY}&format=json`
    );
    const data = await response.json();
    return data.track;
  } catch (error) {
    console.error("Error fetching Last.fm track info:", error);
    return null;
  }
};

// Generate a monkey-themed image URL based on track and artist
export const generateMonkeyImage = (track: string, artist: string) => {
  // This is a placeholder function - in a real app, you might call an AI service
  // or use a predefined set of monkey images from your assets
  // For now, we'll return a placeholder URL based on the hash of the track + artist

  const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const imageId = hash(`${track}${artist}`) % 10; // Get a number between 0-9
  return `https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80&monkey=${imageId}`;
};

// Format Last.fm track data into NFT metadata
export const formatTrackAsNFTMetadata = async (track: LastFmTrack) => {
  const monkeyImage = generateMonkeyImage(track.name, track.artist.name);

  // Get more details about the track
  const trackInfo = await getTrackInfo(track.name, track.artist.name);

  return {
    name: track.name,
    description: `${track.name} by ${track.artist.name}`,
    image: monkeyImage,
    artist: track.artist.name,
    playbackUrl: trackInfo?.url || track.url,
    external_url: track.url,
  };
};
