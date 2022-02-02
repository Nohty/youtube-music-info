namespace background {
  let SETTINGS: Settings = {
    enabled: true,
    url: "http://localhost:3002/",
  };

  const MUSIC_URL = "https://music.youtube.com/";

  let interval: number | null = null;
  let tabId: number | null = null;

  async function saveSettings(settings: Settings) {
    await chrome.storage.local.set({ settings });
  }

  async function getSettings(): Promise<Settings> {
    return (await chrome.storage.local.get("settings")).settings;
  }

  function handleTabUpdate(id: number, changeInfo: any, tab: chrome.tabs.Tab) {
    if (tab.status === "complete") {
      if (tab.url?.startsWith(MUSIC_URL) && !tabId && SETTINGS.enabled) {
        tabId = id;
        chrome.tabs.sendMessage(id, { type: "init", status: true });
        interval = setInterval(checkTabOpen, 1000);
      } else if (tabId === id && SETTINGS.enabled) {
        chrome.tabs.sendMessage(id, { type: "init", status: true });
      }
    }
  }

  async function checkTabOpen() {
    const tabs = await chrome.tabs.query({ url: MUSIC_URL });
    if (tabs.length === 0) {
      tabId = null;
      if (interval) clearInterval(interval);
    } else {
      if (!tabs.some(({ id }) => id === tabId)) {
        tabId = tabs[0].id!;
        if (SETTINGS.enabled) chrome.tabs.sendMessage(tabId, { type: "init", status: true });
      }
    }
  }

  async function handleMessage(message: any, sender: chrome.runtime.MessageSender) {
    if (message.type === "update") {
      SETTINGS = await getSettings();
      if (!SETTINGS.enabled && tabId) {
        chrome.tabs.sendMessage(tabId, { type: "init", status: false });
      } else if (SETTINGS.enabled && tabId) {
        chrome.tabs.sendMessage(tabId, { type: "init", status: true });
      }
    }
  }

  chrome.runtime.onInstalled.addListener(() => saveSettings(SETTINGS));
  chrome.runtime.onMessage.addListener(handleMessage);
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
}
