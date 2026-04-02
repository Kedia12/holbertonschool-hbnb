const DEFAULT_API_BASE_URL = "http://127.0.0.1:5000/api/v1";
const AUTH_COOKIE_NAMES = ["hbnb_token", "token"];
const LAST_PLACE_STORAGE_KEY = "hbnb_last_place";

function resolveApiBaseUrl() {
  if (window.HBNB_API_BASE_URL) {
    return window.HBNB_API_BASE_URL;
  }

  const isLocalHost = ["127.0.0.1", "localhost"].includes(window.location.hostname);
  const isNonApiLocalPort = window.location.port && window.location.port !== "5000";

  // When frontend is served locally by a static server (for example :5500),
  // target the Flask API on :5000 instead of the frontend origin.
  if (isLocalHost && isNonApiLocalPort) {
    return DEFAULT_API_BASE_URL;
  }

  if (window.location.protocol.startsWith("http")) {
    return `${window.location.origin}/api/v1`;
  }

  return DEFAULT_API_BASE_URL;
}

const API_BASE_URL = resolveApiBaseUrl();

function getCookie(name) {
  const parts = document.cookie.split(";").map((part) => part.trim());

  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      return decodeURIComponent(part.substring(name.length + 1));
    }
  }

  return "";
}

function getAuthToken() {
  for (const cookieName of AUTH_COOKIE_NAMES) {
    const token = getCookie(cookieName);
    if (token) {
      return token;
    }
  }

  return "";
}

function saveLastViewedPlace(place) {
  if (!place || !place.id) {
    return;
  }

  const payload = {
    id: String(place.id),
    title: place.title || "",
  };

  localStorage.setItem(LAST_PLACE_STORAGE_KEY, JSON.stringify(payload));
}

function getLastViewedPlace() {
  const raw = localStorage.getItem(LAST_PLACE_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id) {
      return null;
    }

    return {
      id: String(parsed.id),
      title: parsed.title || "",
    };
  } catch {
    return null;
  }
}

function setAuthToken(token) {
  const cookieValue = encodeURIComponent(token);
  document.cookie = `hbnb_token=${cookieValue}; path=/; SameSite=Lax`;
  document.cookie = `token=${cookieValue}; path=/; SameSite=Lax`;
}

function clearAuthToken() {
  document.cookie = "hbnb_token=; Max-Age=0; path=/; SameSite=Lax";
  document.cookie = "token=; Max-Age=0; path=/; SameSite=Lax";
}

function redirectToLoginWithNext() {
  const next = encodeURIComponent(`${window.location.pathname.split("/").pop()}${window.location.search}`);
  window.location.href = `login.html?next=${next}`;
}

function buildURLWithPlace(path, placeId, placeTitle = "") {
  if (!placeId) {
    return path;
  }

  const params = new URLSearchParams({ id: placeId });
  if (placeTitle) {
    params.set("title", placeTitle);
  }

  return `${path}?${params.toString()}`;
}

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || params.get("place_id") || "";
}

function getPlaceTitleFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("title") || params.get("name") || "";
}

function applyAuthVisibility(token) {
  const loginLink = document.getElementById("login-link");
  const logoutButton = document.getElementById("logout-button");

  if (loginLink) {
    loginLink.classList.toggle("is-hidden", Boolean(token));
  }

  if (logoutButton) {
    logoutButton.classList.toggle("is-hidden", !token);

    if (!logoutButton.dataset.bound) {
      logoutButton.dataset.bound = "true";
      logoutButton.addEventListener("click", () => {
        clearAuthToken();
        window.location.href = "index.html";
      });
    }
  }
}

function updateNavContext(placeId = "", placeTitle = "") {
  const fallback = getLastViewedPlace();
  const resolvedPlaceId = placeId || fallback?.id || "";
  const resolvedPlaceTitle = placeTitle || fallback?.title || "";

  document.querySelectorAll('a[href^="place.html"]').forEach((link) => {
    link.href = buildURLWithPlace("place.html", resolvedPlaceId, resolvedPlaceTitle);
  });

  document.querySelectorAll('a[href^="add_review.html"]').forEach((link) => {
    link.href = buildURLWithPlace("add_review.html", resolvedPlaceId, resolvedPlaceTitle);
  });
}

function setMessage(element, text, type = "") {
  if (!element) {
    return;
  }

  element.textContent = text;
  element.classList.remove("error", "success");

  if (type) {
    element.classList.add(type);
  }
}

async function requestJSON(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Cannot reach API server. Verify that backend is running.");
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = data?.error || data?.message || response.statusText || "Request failed";
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return data;
}

async function loginUser(email, password) {
  return requestJSON(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

async function fetchPlaces(token) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return requestJSON(`${API_BASE_URL}/places/`, {
    headers,
  });
}

async function fetchPlaceDetails(token, placeId) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return requestJSON(`${API_BASE_URL}/places/${placeId}`, {
    headers,
  });
}

async function submitReview(token, placeId, reviewText, rating) {
  return requestJSON(`${API_BASE_URL}/reviews/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      place_id: placeId,
      text: reviewText,
      rating,
    }),
  });
}

function renderPlaces(places) {
  const placesList = document.getElementById("places-list");
  const message = document.getElementById("places-message");
  const token = getAuthToken();

  if (!placesList) {
    return;
  }

  placesList.querySelectorAll(".place-card").forEach((card) => card.remove());

  if (!Array.isArray(places) || places.length === 0) {
    setMessage(message, "No places available right now.");
    return;
  }

  setMessage(message, "");

  for (const place of places) {
    const card = document.createElement("article");
    card.className = "place-card";
    card.dataset.price = String(place.price ?? 0);

    const title = document.createElement("h3");
    title.textContent = place.title || "Untitled place";

    const description = document.createElement("p");
    description.textContent = place.description || "No description available.";

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = `$${Number(place.price || 0)} / night`;

    const detailsLink = document.createElement("a");
    detailsLink.className = "details-button";
    detailsLink.textContent = "View Details";
    detailsLink.href = buildURLWithPlace("place.html", String(place.id), place.title || "");

    card.append(title, description, price, detailsLink);

    if (token) {
      const reviewLink = document.createElement("a");
      reviewLink.className = "secondary-button";
      reviewLink.textContent = "Add Review";
      reviewLink.href = buildURLWithPlace("add_review.html", String(place.id), place.title || "");
      card.appendChild(reviewLink);
    }

    placesList.appendChild(card);
  }
}

function filterPlacesByPrice() {
  const filter = document.getElementById("price-filter");
  const cards = document.querySelectorAll(".place-card");

  if (!filter || cards.length === 0) {
    return;
  }

  const selectedPrice = filter.value;

  cards.forEach((card) => {
    const cardPrice = Number(card.dataset.price || 0);
    const shouldShow = selectedPrice === "all" || cardPrice <= Number(selectedPrice);
    card.style.display = shouldShow ? "flex" : "none";
  });
}

function renderPlaceDetails(place, token) {
  const detailsContainer = document.getElementById("place-details");
  const reviewsList = document.getElementById("review-list");
  const addReviewSection = document.getElementById("add-review");
  const placeMessage = document.getElementById("place-message");

  if (!detailsContainer) {
    return;
  }

  saveLastViewedPlace(place);
  updateNavContext(String(place.id), place.title || "");

  const hostName = place.host
    ? `${place.host.first_name || ""} ${place.host.last_name || ""}`.trim()
    : "Unknown host";

  detailsContainer.innerHTML = `
    <h3>${place.title || "Untitled place"}</h3>
    <div class="place-info">
      <h4>Host</h4>
      <p>Hosted by ${hostName || "Unknown host"}</p>
    </div>
    <div class="place-info">
      <h4>Price</h4>
      <p class="price">$${Number(place.price || 0)} / night</p>
    </div>
    <div class="place-info">
      <h4>Description</h4>
      <p>${place.description || "No description available."}</p>
    </div>
    <div class="place-info">
      <h4>Amenities</h4>
      <ul>
        ${(place.amenities || []).map((amenity) => `<li>${amenity.name}</li>`).join("") || "<li>No amenities listed.</li>"}
      </ul>
    </div>
  `;

  if (reviewsList) {
    reviewsList.querySelectorAll(".review-card").forEach((card) => card.remove());

    if (place.reviews && place.reviews.length > 0) {
      setMessage(document.getElementById("review-message"), "");

      for (const review of place.reviews) {
        const reviewCard = document.createElement("article");
        reviewCard.className = "review-card";

        const reviewText = document.createElement("p");
        reviewText.textContent = review.text || "No comment provided.";

        const reviewMeta = document.createElement("div");
        reviewMeta.className = "review-meta";
        const authorName = review.user
          ? `${review.user.first_name || ""} ${review.user.last_name || ""}`.trim()
          : "Unknown user";
        reviewMeta.textContent = `By: ${authorName || "Unknown user"} | Rating: ${review.rating ?? "-"}/5`;

        reviewCard.append(reviewText, reviewMeta);
        reviewsList.appendChild(reviewCard);
      }
    } else {
      setMessage(document.getElementById("review-message"), "No reviews yet.");
    }
  }

  if (addReviewSection) {
    if (!token) {
      addReviewSection.classList.add("is-hidden");
      addReviewSection.innerHTML = "";
      return;
    }

    addReviewSection.classList.remove("is-hidden");
    addReviewSection.innerHTML = `
      <form action="#" method="post" class="form" id="inline-review-form">
        <div class="field">
          <p class="review-target">Add a review for ${place.title || "this place"}</p>
        </div>
        <div class="field">
          <label for="inline-rating">Rating</label>
          <select id="inline-rating" name="rating" required>
            <option value="">Select rating</option>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
        <div class="field">
          <label for="inline-comment">Comment</label>
          <textarea id="inline-comment" name="comment" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="primary-button">Submit Review</button>
          <a class="secondary-button" href="${buildURLWithPlace("add_review.html", String(place.id), place.title || "")}">Open Full Review Page</a>
        </div>
        <p class="page-message" id="inline-review-message" aria-live="polite"></p>
      </form>
    `;

    const inlineReviewForm = document.getElementById("inline-review-form");
    inlineReviewForm?.addEventListener("submit", async (event) => {
      event.preventDefault();

      const rating = document.getElementById("inline-rating").value;
      const comment = document.getElementById("inline-comment").value.trim();
      const inlineMessage = document.getElementById("inline-review-message");

      try {
        await submitReview(token, place.id, comment, Number(rating));
        setMessage(inlineMessage, "Review submitted successfully!", "success");
        const updatedPlace = await fetchPlaceDetails(token, place.id);
        renderPlaceDetails(updatedPlace, token);
      } catch (error) {
        setMessage(inlineMessage, error.message, "error");
      }
    });
  }

  setMessage(placeMessage, "");
}

async function initializeLoginPage() {
  const loginForm = document.getElementById("login-form");
  const message = document.getElementById("login-message");
  const token = getAuthToken();

  applyAuthVisibility(token);
  updateNavContext();

  if (token && message) {
    setMessage(message, "You are already connected.", "success");
  }

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const data = await loginUser(email, password);
      setAuthToken(data.access_token);
      setMessage(message, "Login successful. Redirecting...", "success");
      const nextPage = new URLSearchParams(window.location.search).get("next");
      window.location.href = nextPage || "index.html";
    } catch (error) {
      setMessage(message, `Login failed: ${error.message}`, "error");
    }
  });
}

async function initializeIndexPage() {
  const token = getAuthToken();
  applyAuthVisibility(token);
  updateNavContext();

  const placesMessage = document.getElementById("places-message");

  try {
    const places = await fetchPlaces(token);
    window.__places = Array.isArray(places) ? places : [];
    renderPlaces(window.__places);
    filterPlacesByPrice();
  } catch (error) {
    if (error.status === 401 && token) {
      clearAuthToken();
      applyAuthVisibility("");

      try {
        const places = await fetchPlaces("");
        window.__places = Array.isArray(places) ? places : [];
        renderPlaces(window.__places);
        filterPlacesByPrice();
        return;
      } catch (retryError) {
        setMessage(placesMessage, retryError.message, "error");
        return;
      }
    }

    setMessage(placesMessage, error.message, "error");
  }

  const priceFilter = document.getElementById("price-filter");
  priceFilter?.addEventListener("change", filterPlacesByPrice);
}

async function initializePlacePage() {
  const token = getAuthToken();
  applyAuthVisibility(token);

  const placeId = getPlaceIdFromURL();
  const placeTitle = getPlaceTitleFromURL();
  const placeMessage = document.getElementById("place-message");

  updateNavContext(placeId, placeTitle);

  if (!placeId) {
    setMessage(placeMessage, "Missing place id in the URL.", "error");
    return;
  }

  try {
    const place = await fetchPlaceDetails(token, placeId);
    renderPlaceDetails(place, token);
  } catch (error) {
    if (error.status === 401 && token) {
      clearAuthToken();
      applyAuthVisibility("");

      try {
        const place = await fetchPlaceDetails("", placeId);
        renderPlaceDetails(place, "");
        return;
      } catch (retryError) {
        setMessage(placeMessage, retryError.message, "error");
        return;
      }
    }

    setMessage(placeMessage, error.message, "error");
  }
}

async function initializeAddReviewPage() {
  const token = getAuthToken();
  applyAuthVisibility(token);

  const lastPlace = getLastViewedPlace();
  const placeIdFromURL = getPlaceIdFromURL();
  const placeTitleFromURL = getPlaceTitleFromURL();
  updateNavContext(placeIdFromURL || lastPlace?.id || "", placeTitleFromURL || lastPlace?.title || "");

  if (!token) {
    redirectToLoginWithNext();
    return;
  }

  const reviewForm = document.getElementById("review-form");
  const reviewMessage = document.getElementById("review-message");
  const placeSelect = document.getElementById("place-select");
  const placeId = placeIdFromURL || lastPlace?.id || "";
  const selectedPlaceName = document.getElementById("selected-place-name");
  const placeIdInput = document.getElementById("place-id");
  let activePlaceId = "";

  try {
    const places = await fetchPlaces(token);
    const safePlaces = Array.isArray(places) ? places : [];

    if (!placeSelect || safePlaces.length === 0) {
      setMessage(reviewMessage, "No place available for review.", "error");
      return;
    }

    safePlaces.forEach((place) => {
      const option = document.createElement("option");
      option.value = String(place.id);
      option.textContent = place.title || `Place ${place.id}`;
      placeSelect.appendChild(option);
    });

    if (placeId && safePlaces.some((place) => String(place.id) === placeId)) {
      activePlaceId = placeId;
    } else {
      activePlaceId = String(safePlaces[0].id);
    }

    placeSelect.value = activePlaceId;
    placeIdInput.value = activePlaceId;
  } catch (error) {
    setMessage(reviewMessage, error.message, "error");
    return;
  }

  const setSelectedPlace = async (id) => {
    activePlaceId = id;
    placeIdInput.value = id;

    try {
      const place = await fetchPlaceDetails(token, id);
      selectedPlaceName.textContent = `Reviewing: ${place.title || "this place"}`;
      saveLastViewedPlace(place);
      updateNavContext(String(place.id), place.title || "");
      setMessage(reviewMessage, "", "");
    } catch (error) {
      if (error.status === 401) {
        clearAuthToken();
        redirectToLoginWithNext();
        return;
      }

      selectedPlaceName.textContent = "Reviewing selected place";
      setMessage(reviewMessage, error.message, "error");
    }
  };

  await setSelectedPlace(activePlaceId);

  placeSelect?.addEventListener("change", async (event) => {
    await setSelectedPlace(event.target.value);
  });

  reviewForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const comment = document.getElementById("comment").value.trim();
    const rating = Number(document.getElementById("rating").value);

    if (!activePlaceId) {
      setMessage(reviewMessage, "Please select a place.", "error");
      return;
    }

    if (!comment || !rating) {
      setMessage(reviewMessage, "Rating and comment are required.", "error");
      return;
    }

    try {
      await submitReview(token, activePlaceId, comment, rating);
      setMessage(reviewMessage, "Review submitted successfully!", "success");
      reviewForm.reset();
      placeIdInput.value = activePlaceId;
    } catch (error) {
      setMessage(reviewMessage, error.message, "error");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("login-form")) {
    initializeLoginPage();
  }

  if (document.getElementById("places-list")) {
    initializeIndexPage();
  }

  if (document.getElementById("place-details")) {
    initializePlacePage();
  }

  if (document.getElementById("review-form")) {
    initializeAddReviewPage();
  }
});