# Palette Studio Website
Palette Studio Website
A premium, responsive makeup/beauty studio website created as a fresh UI inspired by the supplied reference, but with a different structure and visual system.
Files
index.html — page structure and editable content
style.css — complete responsive styling
script.js — loader, mobile navigation, scroll reveal and cursor effects
Replace NIL
Search for NIL in index.html and replace:
Artist name
Location
Phone / WhatsApp
Email
Instagram
Experience
Services and descriptions
Client reviews
Image placeholders
Adding your photos
Replace the placeholder <div class="gallery-placeholder"> blocks with <img> tags, for example:
�
￼
Create an images folder and place your photos there.
Deploy on GitHub Pages
Create a GitHub repository.
Upload index.html, style.css, script.js, and your images folder.
Go to Settings → Pages.
Choose the main branch and root folder.
Save.
The Google Fonts import requires internet access. The site still has fallback fonts if the font service is unavailable.
## WhatsApp enquiry number
The contact form sends the submitted client details to WhatsApp.

To change the destination number, open `script.js` and edit:

```js
const WHATSAPP_NUMBER = "91888******6";
```

Use the full international country code without `+`, spaces or dashes.

Example for an Indian number `8884*****6`:
`918884*****6`

## Contact form
Required fields:
- Full Name
- Phone / WhatsApp
- Service
- Event Date

Email and Message / Requirements are optional.

The form validates required fields in the browser and opens WhatsApp with the enquiry details pre-filled.

## Header and mobile menu
The header is fixed while scrolling. On mobile, opening the menu locks page scrolling and displays the menu as a full-height panel below the fixed header so it does not overlap the page content.
