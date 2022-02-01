namespace background {
  const SETTINGS: Settings = {
    enabled: true,
    url: "http://localhost:3002/",
  };

  async function saveSettings(settings: Settings) {
    await chrome.storage.sync.set({ settings });
  }

  chrome.runtime.onInstalled.addListener(() => saveSettings(SETTINGS));
}
