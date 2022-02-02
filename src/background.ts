namespace background {
  const SETTINGS: Settings = {
    enabled: true,
    url: "http://localhost:3002/",
  };

  const MUSIC_URL = "https://music.youtube.com/";

  let interval: number | null = null;
  let MUSIC_INFO: MusicInfo;
  let SOCKET: any = null;

  async function saveSettings(settings: Settings) {
    await chrome.storage.local.set({ settings });
  }

  async function handleTabUpdate(tabId: any, changeInfo: any, tab: chrome.tabs.Tab) {
    if (tab.status === "complete") {
      if (tab.url?.startsWith(MUSIC_URL) && !SOCKET) {
        createSocketServer();
        interval = setInterval(checkTabOpen, 1000);
      }
    }
  }

  async function checkTabOpen() {
    console.log("checkTabOpen");
    const tabs = await chrome.tabs.query({ url: MUSIC_URL });
    if (tabs.length === 0) {
      closeSocketServer();
      if (interval) clearInterval(interval);
    }
  }

  async function createSocketServer() {
    console.log("Creating socket server");
    SOCKET = true;
  }

  async function closeSocketServer() {
    console.log("Closing socket server");
    SOCKET = null;
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
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
}
