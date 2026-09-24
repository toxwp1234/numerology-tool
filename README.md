# Numerology Tool

Rozszerzenie przeglądarki, które pokazuje wartość numerologiczną zaznaczonego tekstu
w menu kontekstowym (prawy przycisk myszy) w formacie `zredukowana / surowa`.

Litery A–Z mają wartości 1–9 (A=1 … I=9, J=1 …), cyfry liczą się same za siebie.
Liczby mistrzowskie 11, 22 i 33 nie są redukowane.

## Struktura

```
chrome/     Manifest V3 dla Chrome / Edge (service worker)
firefox/    Manifest V3 dla Firefoksa (event page, API browser.*, gecko id)
site/       strona do pobrania: https://toxwp1234.github.io/numerology-tool/
.github/workflows/release.yml   podpisanie .xpi przez Mozillę + GitHub Release
.github/workflows/pages.yml     publikacja strony na GitHub Pages
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

### Wydanie nowej wersji

1. Podnieś `"version"` w `firefox/manifest.json` **i** `chrome/manifest.json` (muszą być równe).
2. Commit, potem tag z tym samym numerem:
   ```bash
   git tag v1.1
   git push origin main v1.1
   ```

Workflow **Release** podpisze `.xpi` u Mozilli, spakuje wersję dla Chrome, doda oba pliki
do GitHub Release i zaktualizuje stronę. Mozilla nie podpisze dwa razy tej samej wersji.
Pole `gecko.id` ustala się przy pierwszym podpisaniu i nie należy go potem zmieniać.

### Lokalnie zamiast GitHuba (wymaga Node.js)

```bash
npx web-ext sign --source-dir firefox --channel unlisted --api-key <JWT issuer> --api-secret <JWT secret>
```

### Instalacja u znajomych

Wyślij link do strony: https://toxwp1234.github.io/numerology-tool/ — przycisk
instaluje dodatek od razu. Albo przeciągnij plik `.xpi` do okna Firefoksa.
Wymagany Firefox 140+.
