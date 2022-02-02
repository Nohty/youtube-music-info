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

  const MUSIC_URL = "https://music.youtube.com/";

  let info: MusicInfo = createEmptyInfo();
  let socket: any;
  let interval: number;

  function getInformation(): MusicInfo {
    const songInfoArray = songInfo?.innerText.split("\n");
    return {
      title: title?.innerText || null,
      artist: songInfoArray?.[0] || null,
      album: songInfoArray?.[2] || null,
      year: songInfoArray?.[4] || null,
      image: image?.src.startsWith(MUSIC_URL) ? null : image?.src!,
      url: window.location.href === MUSIC_URL ? null : window.location.href,
      playing: playing?.title === "Pause" || false,
    };
  }

  function equals(obj1: Object, obj2: Object) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  function createEmptyInfo() {
    return {
      title: null,
      artist: null,
      album: null,
      year: null,
      image: null,
      url: null,
      playing: false,
    };
  }

  function checkInformation() {
    const newInfo = getInformation();
    if (!equals(info, newInfo)) {
      info = newInfo;
      socket.emit("yt-music", info);
    }
  }

  async function getSettings(): Promise<Settings> {
    return (await chrome.storage.local.get("settings")).settings;
  }

  async function enableSocketClient() {
    socket = io((await getSettings()).url);
    socket.on("yt-music:update", () => socket.emit("yt-music", info));
    interval = setInterval(checkInformation, 1000);
  }

  function disableSocketClient() {
    socket.close();
    clearInterval(interval);
  }

  function handleMessage(message: any) {
    if (message.type === "init") {
      if (message.status) enableSocketClient();
      else disableSocketClient();
    }
  }

  chrome.runtime.onMessage.addListener(handleMessage);
}
