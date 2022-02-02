namespace popup {
  const urlElement = document.getElementById("input-url") as HTMLInputElement;
  const enabledElement = document.getElementById("button-status") as HTMLButtonElement;

  let SETTINGS: Settings;

  async function getSettings(): Promise<Settings> {
    return (await chrome.storage.local.get("settings")).settings;
  }

  async function saveSettings(settings: Settings) {
    await chrome.storage.local.set({ settings });
  }

  function getButtonText() {
    return SETTINGS.enabled ? "Disable" : "Enable";
  }

  async function handleUrlChange(e: Event) {
    SETTINGS.url = (e.target as HTMLInputElement).value;
    await saveSettings(SETTINGS);
  }

  async function handleStatusClick(e: Event) {
    SETTINGS.enabled = !SETTINGS.enabled;
    enabledElement.innerText = getButtonText();
    await saveSettings(SETTINGS);
  }

  async function init() {
    SETTINGS = await getSettings();
    urlElement.value = SETTINGS.url;
    enabledElement.innerText = getButtonText();
    urlElement.addEventListener("change", handleUrlChange);
    enabledElement.addEventListener("click", handleStatusClick);
  }

  init();
}
