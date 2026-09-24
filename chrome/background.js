// Tworzymy menu przy instalacji
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "calcNumerology",
    title: "Numerologia: zaznacz tekst",
    contexts: ["selection"]
  });
});

// Odbieramy gotowy tytuł z content.js i aktualizujemy menu
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateTitle") {
    chrome.contextMenus.update("calcNumerology", {
      title: message.title
    });
  }
  // Ważne: zwracamy true żeby Chrome nie zamknął kanału przedwcześnie
  return true;
});
