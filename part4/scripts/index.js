const API_BASE_URL = getApiBaseUrl();
let allPlaces = [];

document.addEventListener("DOMContentLoaded", async () => {
  const token = getAuthToken();
  checkAuthentication(token);
  setupLogout();

  const priceFilter = document.getElementById("price-filter");
  if (priceFilter) {
    priceFilter.addEventListener("change", () => {
      displayPlaces(applyPriceFilter(allPlaces));
    });
  }

  await fetchPlaces(token);
});

function checkAuthentication(token) {
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");

  if (!loginLink) {
    return;
  }

  loginLink.style.display = token ? "none" : "inline-flex";
  if (logoutLink) {
    logoutLink.hidden = !token;
    logoutLink.style.display = token ? "inline-flex" : "none";
  }
}

function setupLogout() {
  const logoutLink = document.getElementById("logout-link");
  if (!logoutLink) {
    return;
  }

  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    clearAuth();
    window.location.href = "index.html";
  });
}

function clearAuth() {
  document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
  try {
    localStorage.removeItem("token");
  } catch (error) {
    // Ignore storage access issues.
  }
}

function getCookie(name) {
  const cookieName = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie ? document.cookie.split(";") : [];

  for (const part of cookies) {
    const cookie = part.trim();
    if (cookie.startsWith(cookieName)) {
      return decodeURIComponent(cookie.substring(cookieName.length));
    }
  }

  return null;
}

function getAuthToken() {
  const cookieToken = getCookie("token");
  if (cookieToken) {
    return cookieToken;
  }

  try {
    const localToken = localStorage.getItem("token");
    return localToken || null;
  } catch (error) {
    return null;
  }
}

async function fetchPlaces(token) {
  const feedback = document.getElementById("places-feedback");

  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/places/`, {
      method: "GET",
      headers
    });

    if (!response.ok) {
      throw new Error(`Unable to load places (${response.status})`);
    }

    const data = await response.json();
    allPlaces = Array.isArray(data) ? data : [];

    if (feedback) {
      feedback.hidden = true;
      feedback.textContent = "";
    }

    displayPlaces(applyPriceFilter(allPlaces));
  } catch (error) {
    allPlaces = [];
    displayPlaces([]);

    if (feedback) {
      feedback.textContent = error.message || "Unable to load places.";
      feedback.hidden = false;
    }
  }
}

function getApiBaseUrl() {
  if (window.HBNB_API_BASE_URL) {
    return window.HBNB_API_BASE_URL.replace(/\/$/, "");
  }

  const isLocalHost =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (isLocalHost) {
    return "http://127.0.0.1:5000/api/v1";
  }

  const codespacesMatch = window.location.hostname.match(/^(.*)-\d+\.app\.github\.dev$/);
  if (codespacesMatch) {
    return `${window.location.protocol}//${codespacesMatch[1]}-5000.app.github.dev/api/v1`;
  }

  return `${window.location.protocol}//${window.location.hostname}:5000/api/v1`;
}

function applyPriceFilter(places) {
  const select = document.getElementById("price-filter");
  const selected = select ? select.value : "all";

  if (selected === "all") {
    return places;
  }

  const maxPrice = Number(selected);
  if (Number.isNaN(maxPrice)) {
    return places;
  }

  return places.filter((place) => Number(place.price) <= maxPrice);
}

function displayPlaces(places) {
  const list = document.getElementById("places-list");
  if (!list) {
    return;
  }

  list.innerHTML = "";

  if (places.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No places found for this filter.";
    list.appendChild(empty);
    return;
  }

  for (const place of places) {
    const card = document.createElement("article");
    card.className = "place-card";

    const title = document.createElement("h2");
    title.textContent = place.title || "Untitled place";

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = `$${Number(place.price) || 0} / night`;

    const description = document.createElement("p");
    description.textContent = place.description || "No description available.";

    const location = document.createElement("p");
    location.className = "muted";
    location.textContent = `Location: ${formatLocation(place.latitude, place.longitude)}`;

    const details = document.createElement("a");
    details.className = "details-button";
    details.href = `place.html?place_id=${encodeURIComponent(place.id || "")}`;
    details.textContent = "View Details";

    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(description);
    card.appendChild(location);
    card.appendChild(details);

    list.appendChild(card);
  }
}

function formatLocation(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return "Not provided";
  }

  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}
