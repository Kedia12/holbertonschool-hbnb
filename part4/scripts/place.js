const PLACE_API_BASE_URL = getApiBaseUrl();

document.addEventListener("DOMContentLoaded", async () => {
  const token = getAuthToken();
  let placeId = getPlaceIdFromURL();

  checkAuthentication(token);
  setupLogout();

  if (!placeId) {
    placeId = await getFirstPlaceId(token);
    if (!placeId) {
      showFeedback("No place ID was provided and no places are available.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("place_id", placeId);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }

  await fetchPlaceDetails(token, placeId);
});

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("place_id") || params.get("placeId") || params.get("id");
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

function checkAuthentication(token) {
  const addReviewSection = document.getElementById("add-review-section");
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");

  if (addReviewSection) {
    addReviewSection.hidden = !token;
  }

  if (loginLink) {
    loginLink.style.display = token ? "none" : "inline-flex";
  }

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

async function fetchPlaceDetails(token, placeId) {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${PLACE_API_BASE_URL}/places/${encodeURIComponent(placeId)}`, {
      method: "GET",
      headers
    });

    if (!response.ok) {
      throw new Error(`Unable to load place details (${response.status})`);
    }

    const place = await response.json();
    hideFeedback();
    displayPlaceDetails(place);
  } catch (error) {
    showFeedback(error.message || "Unable to load place details.");
  }
}

async function getFirstPlaceId(token) {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${PLACE_API_BASE_URL}/places/`, {
      method: "GET",
      headers
    });

    if (!response.ok) {
      return null;
    }

    const places = await response.json();
    if (!Array.isArray(places) || places.length === 0) {
      return null;
    }

    return places[0].id || null;
  } catch (error) {
    return null;
  }
}

function displayPlaceDetails(place) {
  const title = document.getElementById("detail-title");
  const detailsContainer = document.getElementById("place-details");
  const reviewsContainer = document.getElementById("reviews-list");
  const addReviewLink = document.getElementById("add-review-link");

  if (title) {
    title.textContent = place.title || "Place Details";
  }

  if (detailsContainer) {
    detailsContainer.innerHTML = "";

    detailsContainer.appendChild(makeCard("Host", formatHost(place)));
    detailsContainer.appendChild(makeCard("Price", `$${Number(place.price) || 0} / night`, true));
    detailsContainer.appendChild(makeCard("Description", place.description || "No description available."));

    const amenitiesCard = document.createElement("article");
    amenitiesCard.className = "card";
    const amenitiesTitle = document.createElement("h2");
    amenitiesTitle.textContent = "Amenities";
    amenitiesCard.appendChild(amenitiesTitle);

    const amenities = Array.isArray(place.amenities) ? place.amenities : [];
    if (amenities.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No amenities listed.";
      amenitiesCard.appendChild(empty);
    } else {
      const list = document.createElement("ul");
      for (const amenity of amenities) {
        const item = document.createElement("li");
        item.textContent = amenity.name || "Unnamed amenity";
        list.appendChild(item);
      }
      amenitiesCard.appendChild(list);
    }

    detailsContainer.appendChild(amenitiesCard);
  }

  if (reviewsContainer) {
    reviewsContainer.innerHTML = "";

    const reviews = Array.isArray(place.reviews) ? place.reviews : [];
    if (reviews.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No reviews yet.";
      reviewsContainer.appendChild(empty);
      return;
    }

    for (const review of reviews) {
      const card = document.createElement("article");
      card.className = "review-card";

      const comment = document.createElement("p");
      comment.innerHTML = `<strong>Comment:</strong> ${escapeHtml(review.text || "")}`;

      const user = document.createElement("p");
      user.innerHTML = `<strong>User:</strong> ${escapeHtml(formatReviewUser(review.user))}`;

      const rating = document.createElement("p");
      rating.innerHTML = `<strong>Rating:</strong> ${Number(review.rating) || 0}/5`;

      card.appendChild(comment);
      card.appendChild(user);
      card.appendChild(rating);

      reviewsContainer.appendChild(card);
    }
  }

  if (addReviewLink) {
    addReviewLink.href = `add_review.html?place_id=${encodeURIComponent(place.id || "")}`;
  }
}

function makeCard(title, content, isPrice = false) {
  const card = document.createElement("article");
  card.className = "card";

  const heading = document.createElement("h2");
  heading.textContent = title;

  const body = document.createElement("p");
  body.textContent = content;
  if (isPrice) {
    body.className = "price";
  }

  card.appendChild(heading);
  card.appendChild(body);
  return card;
}

function formatHost(place) {
  if (!place) {
    return "Host not available";
  }

  const host = place.host;
  if (!host) {
    return place.owner_id || "Host not available";
  }

  const first = host.first_name || "";
  const last = host.last_name || "";
  const full = `${first} ${last}`.trim();
  return full || host.email || "Host not available";
}

function formatReviewUser(user) {
  if (!user) {
    return "Unknown user";
  }

  const first = user.first_name || "";
  const last = user.last_name || "";
  const full = `${first} ${last}`.trim();
  return full || user.email || "Unknown user";
}

function showFeedback(message) {
  const feedback = document.getElementById("place-feedback");
  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.hidden = false;
}

function hideFeedback() {
  const feedback = document.getElementById("place-feedback");
  if (!feedback) {
    return;
  }

  feedback.textContent = "";
  feedback.hidden = true;
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
