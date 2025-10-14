# JP Stevens Cyberhawks — Static Website

A polished, all-raw-code site for the JP Stevens **Cyberhawks** club. Built as a single-page app with semantic HTML, modern CSS, and vanilla JS tabs. No frameworks. Designed to reflect JP Stevens colors (green & gold) and the neon styling from the provided flyer.

## Quick Start (VS Code)

1. **Open** this folder in VS Code.
2. Use any local server (e.g., VS Code Live Server extension) **or** run the Python dev server below.
3. Visit `http://localhost:8000/`.

### Python local server
```bash
python3 dev_server.py
```
(Serves the site on port 8000.)

## Content Source (Verbatim)
Sector descriptions on the **Sectors** tabs are quoted verbatim from the provided flyer image:
- Competitive Programming — “Participate in coding competitions & win prizes!”
- Web & Game Design — “Learn new programming languages”, “Make your very own games!”, “Learn how to make a website!”
- Machine Learning — “Learn fundamental AI Theory!”, “Use research tools used by professionals!”
- Cybersecurity — “Develop skills in encryption, networks, and ethical hacking!”, “Participate in cybersecurity competitions & win awards!”

Front page includes:
- **Google Classroom Code:** `5sggvgrx`
- **Advisors:** Ms. Manning & Ms. McLeod
- **Meetings:** Every Monday!

## Assets
- `assets/images/flyer.png` — the flyer screenshot you provided
- `assets/images/calendar.png` — the calendar screenshot you provided (shown under “2025–2026 Calendar”)

> If you replace these images with updated versions using the same filenames, the site will automatically reflect the new content.

## Customization
- Colors live in `css/styles.css` under the `:root` variables.
- Tabs are accessible (ARIA roles) and keyboard-navigable.
- Deep link to a tab: `/#ml`, `/#cyber`, `/#webgame`, or `/#competitive`.

## File Layout
```
cyberhawks-site/
  index.html
  css/
    styles.css
  js/
    main.js
  assets/
    images/
      flyer.png
      calendar.png
  dev_server.py
  README.md
```
