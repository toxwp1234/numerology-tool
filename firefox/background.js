// Firefox: tło działa jako "event page" (brak service workera), API w przestrzeni browser.*

// Tworzymy menu przy instalacji (Firefox zapamiętuje menu między restartami)
browser.runtime.onInstalled.addListener(() => {
  browser.menus.create({
    id: "calcNumerology",
    title: "Numerologia: zaznacz tekst",
    contexts: ["selection"]
  });
});

// Odbieramy gotowy tytuł z content.js i aktualizujemy menu
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "updateTitle") {
    browser.menus.update("calcNumerology", {
      title: message.title
    });
  }
  // Nie odpowiadamy — brak wartości zwrotnej zamyka kanał od razu
});
