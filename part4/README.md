# HBnB Evolution - Part 4

Simple web client built with HTML5, CSS3, and JavaScript ES6.

## Pages

- `index.html` - protected list of places with client-side filtering
- `login.html` - JWT login form
- `place.html` - detailed place view with host, amenities, and reviews
- `add_review.html` - protected review submission form

## API

The client expects the API to run at `http://127.0.0.1:5000/api/v1` by default. You can override it by setting `window.HBNB_API_BASE` before loading `scripts.js` or by storing a value in `localStorage` under `hbnb_api_base`.

## Run

Serve the `part4/` directory with any static file server, then open `index.html`.

Example:

```bash
cd part4
python3 -m http.server 8080
```
