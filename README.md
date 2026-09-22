# 23.09

Treasure's birthday site.

## Files
- `index.html`: the pages
- `style.css`: all styling
- `script.js`: password gate, page navigation, animations, games, candles, letter
- `images/`: the 28 photos

## Set her age (do this first)
Open `script.js`. Line 9 is:

    var AGE = "X";

Change it to her age as a plain number, with no quotes:

    var AGE = 21;

That one number updates the title, the candles heading, the number of candles, the letter line,
last year's birthday, the password (`iloveyou` + age) and the password hints.
While it is still "X", the site shows X in those places and the password is `iloveyoux`.

## Candle messages
In `script.js`, find `EDIT: CANDLE MESSAGES`. There is one line per candle, in order.
Add or remove lines so there is one line for each year of her age.
If there are more candles than lines, the extra candles show `EXTRA_WISH` (just below the list).

## Hosting on GitHub Pages
1. Push these files to the root of a repository.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. The site appears at `https://<username>.github.io/<repo-name>/` after a minute or two.
