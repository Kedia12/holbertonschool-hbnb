const REVIEW_API_BASE_URL = getApiBaseUrl();

document.addEventListener("DOMContentLoaded", async () => {
  const token = getAuthToken();
  let placeId = getPlaceIdFromURL();

  setupLogout();

  if (!checkAuthentication(token)) {
    return;
  }

  if (!placeId) {
    placeId = await getFirstPlaceId(token);
    if (!placeId) {
      showError("No place ID was provided and no places are available.");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("place_id", placeId);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }

  const target = document.getElementById("review-target");
  if (target) {
    target.textContent = `Submitting review for place: ${placeId}`;
  }

  const form = document.getElementById("review-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessages();

    const commentInput = document.getElementById("comment");
    const ratingInput = document.getElementById("rating");
    const submitButton = form.querySelector('button[type="submit"]');

    const reviewText = commentInput ? commentInput.value.trim() : "";
    const rating = ratingInput ? Number(ratingInput.value) : NaN;

    if (!reviewText) {
      showError("Review text is required.");
      return;
    }

    if (Number.isNaN(rating) || rating < 1 || rating > 5) {
      showError("Please choose a rating between 1 and 5.");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    try {
      await submitReview(token, placeId, reviewText, rating);
      showSuccess("Review submitted successfully.");
      form.reset();
    } catch (error) {
      showError(error.message || "Failed to submit review.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Review";
      }
    }
  });
});

async function getFirstPlaceId(token) {
  try {
    const response = await fetch(`${REVIEW_API_BASE_URL}/places/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
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
  if (isLikelyJwt(cookieToken)) {
    return cookieToken;
  }

  try {
    const localToken = localStorage.getItem("token");
    if (isLikelyJwt(localToken)) {
      return localToken;
    }
    return null;
  } catch (error) {
    return null;
  }
}

function isLikelyJwt(token) {
  return typeof token === "string" && token.split(".").length === 3;
}

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("place_id") || params.get("placeId") || params.get("id");
}

function checkAuthentication(token) {
  if (!token) {
    window.location.href = "index.html";
    return false;
  }

  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");
  if (loginLink) {
    loginLink.style.display = "none";
  }

  if (logoutLink) {
    logoutLink.hidden = false;
    logoutLink.style.display = "inline-flex";
  }

  return true;
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

async function submitReview(token, placeId, reviewText, rating) {
  const response = await fetch(`${REVIEW_API_BASE_URL}/reviews/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      place_id: placeId,
      text: reviewText,
      rating
    })
  });

  return handleResponse(response);
}

async function handleResponse(response) {
  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    const message =
      payload.error ||
      payload.message ||
      payload.msg ||
      `Request failed (${response.status})`;

    if (response.status === 401) {
      throw new Error("Authentication expired or invalid. Please log in again.");
    }

    throw new Error(message);
  }

  return payload;
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
}

function showError(message) {
  const errorBox = document.getElementById("review-feedback");
  if (!errorBox) {
    return;
  }

  errorBox.textContent = message;
  errorBox.hidden = false;
}

function showSuccess(message) {
  const successBox = document.getElementById("review-success");
  if (!successBox) {
    return;
  }

  successBox.textContent = message;
  successBox.hidden = false;
}

function clearMessages() {
  const errorBox = document.getElementById("review-feedback");
  const successBox = document.getElementById("review-success");

  if (errorBox) {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }

  if (successBox) {
    successBox.textContent = "";
    successBox.hidden = true;
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
