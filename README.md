# Numerology Tool

Rozszerzenie przeglądarki, które pokazuje wartość numerologiczną zaznaczonego tekstu
w menu kontekstowym (prawy przycisk myszy) w formacie `zredukowana / surowa`.

Litery A–Z mają wartości 1–9 (A=1 … I=9, J=1 …), cyfry liczą się same za siebie.
Liczby mistrzowskie 11, 22 i 33 nie są redukowane.

## Struktura

```
chrome/     Manifest V3 dla Chrome / Edge (service worker)
firefox/    Manifest V3 dla Firefoksa (event page, API browser.*, gecko id)
.github/workflows/sign-firefox.yml   podpisywanie .xpi przez Mozillę
```

Logika obliczeń jest w `content.js` i jest taka sama w obu wersjach — zmieniając
ją, zmień oba pliki.

## Chrome — instalacja lokalna

1. `chrome://extensions` → włącz **Tryb dewelopera**.
2. **Załaduj rozpakowane** → wskaż folder `chrome/`.

## Firefox — testowanie lokalne

`about:debugging#/runtime/this-firefox` → **Załaduj tymczasowy dodatek** → wybierz
`firefox/manifest.json`. (Działa do zamknięcia przeglądarki.)

## Firefox — podpisany plik .xpi dla znajomych

Firefox instaluje na stałe tylko dodatki podpisane przez Mozillę. Kanał *unlisted*
podpisuje plik bez publikowania go w sklepie addons.mozilla.org — dostajesz `.xpi`,
który możesz wysłać komu chcesz.

### Jednorazowo

1. Załóż konto na <https://addons.mozilla.org> i zaakceptuj umowę deweloperską.
2. Wygeneruj klucze API: <https://addons.mozilla.org/developers/addon/api/key/>
   (dostaniesz *JWT issuer* i *JWT secret*).
3. W repozytorium na GitHubie: **Settings → Secrets and variables → Actions** dodaj:
   - `AMO_JWT_ISSUER`
   - `AMO_JWT_SECRET`

### Podpisywanie

- **Actions → Sign Firefox extension → Run workflow** — podpisany `.xpi` pojawi się
  jako artefakt uruchomienia, albo
- wypchnij tag (`git tag v1.0 && git push origin v1.0`) — `.xpi` zostanie dołączony
  do GitHub Release.

Każde podpisanie wymaga **nowego numeru `version`** w `firefox/manifest.json`
(Mozilla nie podpisze dwa razy tej samej wersji). Pole `gecko.id` ustala się przy
pierwszym podpisaniu i nie należy go potem zmieniać.

### Lokalnie zamiast GitHuba (wymaga Node.js)

```bash
npx web-ext sign --source-dir firefox --channel unlisted --api-key <JWT issuer> --api-secret <JWT secret>
```

### Instalacja u znajomych

Przeciągnij plik `.xpi` do okna Firefoksa (lub otwórz go przez
`about:addons` → ⚙ → **Zainstaluj dodatek z pliku**). Wymagany Firefox 140+.
