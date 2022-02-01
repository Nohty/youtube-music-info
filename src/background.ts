namespace background {
  const SETTINGS: Settings = {
    enabled: true,
    url: "http://localhost:3002/",
  };

  let MUSIC_INFO: MusicInfo;

  async function saveSettings(settings: Settings) {
    await chrome.storage.sync.set({ settings });
  }

  function handleMessage(request: any, sender: any, sendResponse: any) {
    if (request.type === "music-info") {
      if (MUSIC_INFO !== request.musicInfo) {
        MUSIC_INFO = request.musicInfo;
      }
    }
  }

  chrome.runtime.onInstalled.addListener(() => saveSettings(SETTINGS));
  chrome.runtime.onMessage.addListener(handleMessage);

  // TODO: Create socket.io client
}
