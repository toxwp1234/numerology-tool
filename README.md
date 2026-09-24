# Numerology Tool

A browser extension for Firefox and Chrome that shows the numerology value of any
text you select. Highlight a word, name or date on any web page, right-click, and the
value appears in the context menu as **reduced / raw**, for example `7 / 25` for
"Hello".

**Download:** [Releases](https://github.com/toxwp1234/numerology-tool/releases/latest)

**Calculator:** https://toxwp1234.github.io/numerology-tool/ shows the Pythagorean
and Chaldean values of any name.

## Install

### Firefox (140 or newer)

1. Download `numerology-tool.xpi` from the
   [latest release](https://github.com/toxwp1234/numerology-tool/releases/latest).
2. Drag the file into a Firefox window, or open `about:addons`, click the gear icon
   and choose **Install Add-on From File**.
3. Click **Add**.

The add-on is signed by Mozilla, so it stays installed after restarting Firefox.

### Chrome, Edge, Brave

1. Download `numerology-tool-chrome.zip` from the
   [latest release](https://github.com/toxwp1234/numerology-tool/releases/latest)
   and unzip it to a folder you'll keep.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and choose the unzipped folder.

## How the value is calculated

The extension uses the Pythagorean letter chart:

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|
| A | B | C | D | E | F | G | H | I |
| J | K | L | M | N | O | P | Q | R |
| S | T | U | V | W | X | Y | Z |   |

- Letters take the value of their column; case doesn't matter.
- Digits count as themselves.
- Spaces, punctuation and accented letters are skipped.
- **Raw** is the sum of all values.
- **Reduced** adds the digits of the sum until one digit is left. The master numbers
  11, 22 and 33 are kept as they are.

Example: `Hello` → H8 + E5 + L3 + L3 + O6 = **25** → 2 + 5 = **7**, shown as `7 / 25`.

## Privacy

The extension runs entirely in your browser. It reads only the text you select and
sends nothing anywhere.

## Development

```
chrome/     Chrome / Edge version (Manifest V3, service worker)
firefox/    Firefox version (Manifest V3, background script)
core/       numerology systems (Pythagorean, Chaldean), used by the website
site/       calculator page, published to GitHub Pages
scripts/    release helper
.github/workflows/
  release.yml   signs the Firefox build with Mozilla and creates a GitHub Release
  pages.yml     publishes the calculator page
```

The calculation lives in `content.js` and is the same in both versions, so change
both files together.

**Test locally**

- Firefox: `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** →
  pick `firefox/manifest.json`.
- Chrome: `chrome://extensions` → **Developer mode** → **Load unpacked** → pick `chrome/`.

**Release a new version**

1. Bump `"version"` in both `firefox/manifest.json` and `chrome/manifest.json`.
2. Commit, then tag with the same number:
   ```bash
   git tag v1.1
   git push origin main v1.1
   ```

The Release workflow sends the Firefox build to Mozilla for signing, packages the
Chrome build and attaches both to a GitHub Release.
Mozilla signs each version number only once. It needs the repository secrets
`AMO_JWT_ISSUER` and `AMO_JWT_SECRET` (API keys from
https://addons.mozilla.org/developers/addon/api/key/).

Changes to `site/` or `core/` go live on their own after a push, without a new
release. To preview the site locally, run `python -m http.server --directory site`
after copying `core/` into `site/core/`.
