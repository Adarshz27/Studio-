# Palette Studio Website

## WhatsApp enquiry number
The contact form sends the submitted client details to WhatsApp.

To change the destination number, open `script.js` and edit:

```js
const WHATSAPP_NUMBER = "918884986006";
```

Use the full international country code without `+`, spaces or dashes.

Example for an Indian number `8884986006`:
`918884986006`

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
