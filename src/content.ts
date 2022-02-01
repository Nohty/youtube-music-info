namespace content {
  const title = document.querySelector<HTMLHeadingElement>(".title.style-scope.ytmusic-player-bar");
  const songInfo = document.querySelector<HTMLHeadingElement>(".byline-wrapper.style-scope.ytmusic-player-bar");
  const image = document.querySelector<HTMLImageElement>(".image.style-scope.ytmusic-player-bar");
  const playing = document.querySelector<HTMLHeadingElement>("#play-pause-button");

  function getInformation(): MusicInfo | null {
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

  // TODO: Send Youtube Music information to background.ts

  getInformation();
}
