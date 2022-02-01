type Settings = {
  enabled: boolean;
  url: string;
};

type MusicInfo = {
  title: string | null;
  artist: string | null;
  album: string | null;
  year: string | null;
  image: string | null;
  url: string | null;
  playing: boolean;
};

enum HTMLSelector {
  TITLE = ".title.style-scope.ytmusic-player-bar",
  SONG_INFO = ".byline-wrapper.style-scope.ytmusic-player-bar",
  IMAGE = ".image.style-scope.ytmusic-player-bar",
  PLAYING = "#play-pause-button",
}
