# Boomerang Revival — Marketing Website

A modern, dark, conversion-focused marketing site for **Boomerang Revival** — a database-reactivation service that helps local businesses recover revenue from past customers.

Built as a fast, dependency-free **static site** (semantic HTML + one CSS design system + a little vanilla JavaScript). No build step, no framework, no `npm install`. Just open it or drag it to a host.

---

## 📁 Project structure

```
boomerang-revival/
├── index.html          ← Home
├── services.html       ← Services (Reactivation, Follow-Up, Retention)
├── about.html          ← About / story / mission
├── testimonials.html   ← Testimonial grid (SAMPLE placeholders)
├── faq.html            ← FAQ accordion
├── contact.html        ← Free-audit contact form
├── css/
│   └── styles.css      ← All styling + design tokens (edit brand here)
├── js/
│   └── main.js         ← Nav, scroll reveals, FAQ, form handling
├── assets/
│   ├── favicon.svg     ← Boomerang favicon
│   └── og-image.svg    ← Social share card
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## 🚀 Deploy it (pick one)

**The site is just static files**, so any static host works.

- **Netlify (easiest):** drag the whole `boomerang-revival` folder onto <https://app.netlify.com/drop>. Done.
- **Vercel:** `vercel` in this folder, or import the repo at <https://vercel.com>.
- **GitHub Pages:** push to a repo → Settings → Pages → deploy from the branch root.
- **Any web host:** upload the folder via FTP/SFTP. `index.html` is the entry point.

**Preview locally** — just open `index.html` in a browser, or run a tiny server for nicer routing:

```bash
cd boomerang-revival
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## ✏️ Editing the content

### Copy / text
All copy lives directly in the HTML files in plain, readable markup. Search for the text you want to change and edit it. Sections are clearly commented (e.g. `<!-- ======= HERO ======= -->`).

### Testimonials  → `testimonials.html`
Each testimonial is one `<figure class="card ...">` block. To add one, copy a block and change the quote, the avatar initials, the name, and the meta line.

> ⚠️ The included testimonials are **sample placeholders** and are visually flagged "Sample — replace with real client." When you replace one with a real, approved quote, **delete its `<span class="sample-flag">…</span>` line** to remove the badge. Don't publish fabricated names or results.

### FAQ  → `faq.html`
Each Q&A is one `.faq-item` block. If you add a new one, keep the `id` / `aria-controls` pair matching (e.g. `q7` ↔ `a7`) so the accordion toggle keeps working.

---

## 📨 Wire up the contact form

Out of the box the form (in `contact.html`) runs in **demo mode**: it validates input and shows a success message, but doesn't send anything. To receive real submissions by email:

1. Create a free form at **<https://formspree.io>** (or use Netlify Forms / Basin / any endpoint that accepts a `POST` of form data and returns JSON).
2. Copy your endpoint — it looks like `https://formspree.io/f/abcd1234`.
3. In `contact.html`, find the form tag and replace the placeholder:

   ```html
   <form id="contact-form" ... action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
   ```

   Swap `YOUR_FORM_ID` for your real ID. That's the only change needed — `js/main.js` automatically detects a real endpoint and POSTs to it.

The form already includes a hidden honeypot field (`_gotcha`) to reduce spam.

---

## ☎️ Replace placeholder contact details

Search the project for these and swap in your real info (they appear in the footer of every page, plus the contact page):

| Placeholder                     | Where                         |
| ------------------------------- | ----------------------------- |
| `hello@boomerangrevival.com`    | footer + contact page         |
| `(850) 000-0000` / `+18500000000` | footer + contact page       |
| `https://boomerangrevival.com`  | canonical/OG tags, sitemap, robots |

> Tip: do a project-wide find-and-replace on `boomerangrevival.com` once you have your real domain.

---

## 🎨 Customizing the look

Open `css/styles.css` — the very top is a **Design Tokens** block (CSS custom properties). Change brand colors, fonts, radii and spacing there and the whole site updates. For example:

```css
:root {
  --bg:      #0B0A12;   /* page background      */
  --violet:  #8B5CF6;   /* primary accent       */
  --heading: #F2F2F7;   /* heading text         */
  --body:    #A1A1AA;   /* body text            */
}
```

Fonts (Space Grotesk + Inter) load from Google Fonts via the `<link>` in each page's `<head>`.

---

## ✅ What's included

- Fully responsive, mobile-first layout with a blur sticky nav + mobile menu
- Dark "premium tech" aesthetic: radial glows, animated grid, grain texture, glassmorphism cards, glowing buttons, animated hero boomerang motif
- Smooth scroll-reveal animations (respects `prefers-reduced-motion`)
- Accessible: semantic HTML, keyboard-navigable, focus styles, ARIA on nav/FAQ/form, good contrast, image alt text
- SEO basics: per-page titles + meta descriptions, Open Graph/Twitter tags, favicon, `sitemap.xml`, `robots.txt`
- Client-side form validation with friendly inline errors, Formspree-ready

---

## ⚖️ Content honesty note

Per the brief, this site **does not** include invented statistics, fake client logos, or fabricated verified results. All testimonials are clearly marked as samples. Replace them with genuine, permission-granted client quotes before going live.
