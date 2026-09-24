// Obliczenia w content.js — nie zależy od uśpionego service workera

function calculateRaw(text) {
  let total = 0;
  const clean = text.toUpperCase();
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    
    // 1. Warunek dla liter (A-Z)
    if (code >= 65 && code <= 90) {
      total += ((code - 65) % 9) + 1;
    } 
    // 2. Warunek dla cyfr (0-9)
    else if (code >= 48 && code <= 57) {
      total += code - 48; // Zamienia kod ASCII cyfry na jej rzeczywistą wartość (np. kod 50 to cyfra 2)
    }
  }
  return total;
}

function reduceToSingleDigit(n) {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) {
    let sum = 0;
    const str = n.toString();
    for (let i = 0; i < str.length; i++) sum += parseInt(str[i]);
    n = sum;
    if (n === 11 || n === 22 || n === 33) return n;
  }
  return n;
}

document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    const raw = calculateRaw(selectedText);
    const reduced = reduceToSingleDigit(raw);
    chrome.runtime.sendMessage({
      action: "updateTitle",
      title: `${reduced} / ${raw}`
    });
  }
});
