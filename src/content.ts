namespace content {
  enum HTMLSelector {
    TITLE = ".title.style-scope.ytmusic-player-bar",
    SONG_INFO = ".byline-wrapper.style-scope.ytmusic-player-bar",
    IMAGE = ".image.style-scope.ytmusic-player-bar",
    PLAYING = "#play-pause-button",
  }

  const title = document.querySelector<HTMLHeadingElement>(HTMLSelector.TITLE);
  const songInfo = document.querySelector<HTMLHeadingElement>(HTMLSelector.SONG_INFO);
  const image = document.querySelector<HTMLImageElement>(HTMLSelector.IMAGE);
  const playing = document.querySelector<HTMLHeadingElement>(HTMLSelector.PLAYING);

  function getInformation(): MusicInfo {
    const songInfoArray = songInfo?.innerText.split("\n");
    return {
      title: title?.innerText || null,
      artist: songInfoArray?.[0] || null,
      album: songInfoArray?.[2] || null,
      year: songInfoArray?.[4] || null,
      image: image?.src || null,
      url: window.location.href,
      playing: playing?.title === "Pause" || false,
    };
  }

  function sendInformation(musicInfo: MusicInfo) {
    chrome.runtime.sendMessage({ type: "music-info", musicInfo });
  }

  setInterval(() => sendInformation(getInformation()), 1000);
}
