const DEFAULT_API_BASE = "http://127.0.0.1:5000/api/v1";
const COOKIE_NAME = "hbnb_token";

function getApiBase() {
    const bodyBase = document.body?.dataset?.apiBase;
    const storedBase = localStorage.getItem("hbnb_api_base");
    return bodyBase || window.HBNB_API_BASE || storedBase || DEFAULT_API_BASE;
}

function buildApiUrl(path) {
    const base = getApiBase().replace(/\/$/, "");
    const suffix = path.startsWith("/") ? path : `/${path}`;
    return `${base}${suffix}`;
}

function getCookie(name) {
    const pattern = new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`);
    const match = document.cookie.match(pattern);
    return match ? decodeURIComponent(match[1]) : "";
}

function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    const sameSite = window.location.protocol === "https:" ? "; SameSite=None; Secure" : "; SameSite=Lax";
    document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/;${sameSite}`;
}

function deleteCookie(name) {
    document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
}

function getToken() {
    return getCookie(COOKIE_NAME);
}

function isAuthenticated() {
    return Boolean(getToken());
}

function logout() {
    deleteCookie(COOKIE_NAME);
    window.location.href = "login.html";
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getToken();

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const finalOptions = {
        ...options,
        headers,
    };

    if (finalOptions.body && typeof finalOptions.body === "object" && !(finalOptions.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
        finalOptions.body = JSON.stringify(finalOptions.body);
    }

    const response = await fetch(buildApiUrl(path), finalOptions);
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
        const message = typeof payload === "string" ? payload : payload.error || payload.message || "Request failed";
        throw new Error(message);
    }

    return payload;
}

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function setActiveAuthAction() {
    const authAction = document.querySelector("[data-auth-action]");
    if (!authAction) {
        return;
    }

    if (isAuthenticated()) {
        authAction.textContent = "Logout";
        authAction.setAttribute("href", "#logout");
        authAction.addEventListener("click", (event) => {
            event.preventDefault();
            logout();
        });
    } else {
        authAction.textContent = "Login";
        authAction.setAttribute("href", "login.html");
    }
}

function requireAuth(redirectTarget = "login.html") {
    if (!isAuthenticated()) {
        window.location.href = redirectTarget;
        return false;
    }
    return true;
}

function getRegion(place) {
    if (place.country) {
        return place.country;
    }

    const latitude = Number(place.latitude);
    const longitude = Number(place.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return "Unknown";
    }

    if (Math.abs(latitude) < 15 && Math.abs(longitude) < 40) {
        return "Equatorial";
    }

    if (latitude >= 0 && longitude < -30) {
        return "Americas";
    }

    if (latitude >= 0 && longitude >= -30 && longitude < 60) {
        return "Europe & North Africa";
    }

    if (latitude >= 0 && longitude >= 60) {
        return "Asia";
    }

    if (latitude < 0 && longitude >= 110) {
        return "Oceania";
    }

    if (latitude < 0 && longitude < 60) {
        return "Southern Hemisphere";
    }

    return "Global";
}

function formatPrice(price) {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
        return "Price on request";
    }
    return `$${numericPrice.toFixed(2)} / night`;
}

function fullName(person) {
    if (!person) {
        return "Unknown host";
    }

    const parts = [person.first_name, person.last_name].filter(Boolean);
    return parts.length ? parts.join(" ") : person.email || "Unknown host";
}

function renderHeaderState() {
    setActiveAuthAction();
}

function setStatus(container, message, tone = "info") {
    if (!container) {
        return;
    }

    container.textContent = message;
    container.dataset.tone = tone;
}

function createEmptyState(message) {
    const section = document.createElement("div");
    section.className = "empty-state";
    section.textContent = message;
    return section;
}

async function loadPlacesPage() {
    if (!requireAuth()) {
        return;
    }

    const container = document.querySelector("[data-places-list]");
    const filter = document.querySelector("[data-country-filter]");
    const status = document.querySelector("[data-status]");
    const searchInput = document.querySelector("[data-search-input]");
    if (!container) {
        return;
    }

    container.innerHTML = "";
    setStatus(status, "Loading available places...");

    try {
        const places = await apiFetch("/places/");
        const normalizedPlaces = places.map((place) => ({
            ...place,
            region: getRegion(place),
        }));

        const regions = Array.from(new Set(normalizedPlaces.map((place) => place.region))).sort((left, right) => left.localeCompare(right));
        if (filter) {
            filter.innerHTML = [
                '<option value="all">All countries / regions</option>',
                ...regions.map((region) => `<option value="${escapeHtml(region)}">${escapeHtml(region)}</option>`),
            ].join("");
        }

        const render = () => {
            const activeRegion = filter?.value || "all";
            const searchTerm = searchInput?.value.trim().toLowerCase() || "";
            const filtered = normalizedPlaces.filter((place) => {
                const matchesRegion = activeRegion === "all" || place.region === activeRegion;
                const matchesSearch = !searchTerm || [place.title, place.description, place.region].filter(Boolean).some((value) => String(value).toLowerCase().includes(searchTerm));
                return matchesRegion && matchesSearch;
            });

            container.innerHTML = "";

            if (!filtered.length) {
                container.appendChild(createEmptyState("No places match the current filters."));
                return;
            }

            filtered.forEach((place) => {
                const card = document.createElement("article");
                card.className = "place-card";
                card.innerHTML = `
                    <div class="card-meta">
                        <span class="pill">${escapeHtml(place.region)}</span>
                        <span class="pill">${escapeHtml(formatPrice(place.price))}</span>
                    </div>
                    <h3>${escapeHtml(place.title)}</h3>
                    <p class="muted">${escapeHtml(place.description || "A comfortable place to stay.")}</p>
                    <div class="location-label">Coordinates: ${escapeHtml(place.latitude)}, ${escapeHtml(place.longitude)}</div>
                    <div class="card-footer">
                        <a class="details-button" href="place.html?place_id=${encodeURIComponent(place.id)}">View Details</a>
                    </div>
                `;
                container.appendChild(card);
            });
        };

        filter?.addEventListener("change", render);
        searchInput?.addEventListener("input", render);
        render();
        setStatus(status, `${normalizedPlaces.length} places available.`, "info");
    } catch (error) {
        setStatus(status, error.message, "error");
        container.innerHTML = "";
        container.appendChild(createEmptyState("Unable to load places right now."));
    }
}

function renderReviewCard(review, reviewerName) {
    const article = document.createElement("article");
    article.className = "review-card";
    article.innerHTML = `
        <div class="review-header">
            <h3>${escapeHtml(reviewerName)}</h3>
            <span class="review-rating">Rating: ${escapeHtml(review.rating ?? 5)} / 5</span>
        </div>
        <p>${escapeHtml(review.text || "No review text provided.")}</p>
    `;
    return article;
}

async function loadPlaceDetailsPage() {
    const placeId = getQueryParam("place_id") || document.body?.dataset?.placeId;
    const container = document.querySelector("[data-place-details]");
    const reviewsContainer = document.querySelector("[data-reviews-list]");
    const reviewStatus = document.querySelector("[data-review-status]");
    const reviewAction = document.querySelector("[data-review-action]");
    const pageStatus = document.querySelector("[data-place-status]");

    if (!placeId || !container) {
        if (container) {
            container.innerHTML = "";
            container.appendChild(createEmptyState("Select a place to view its details."));
        }
        return;
    }

    try {
        const place = await apiFetch(`/places/${encodeURIComponent(placeId)}`);
        const host = place.host || place.owner || null;
        const amenities = Array.isArray(place.amenities) ? place.amenities : [];
        const reviews = Array.isArray(place.reviews) ? place.reviews : [];

        container.innerHTML = `
            <div class="detail-block place-details-card">
                <div class="section-head">
                    <div>
                        <h1>${escapeHtml(place.title)}</h1>
                        <div class="place-info">
                            <span class="pill">${escapeHtml(formatPrice(place.price))}</span>
                            <span class="pill">${escapeHtml(getRegion(place))}</span>
                            <span class="pill">${escapeHtml(place.latitude)}, ${escapeHtml(place.longitude)}</span>
                        </div>
                    </div>
                    <a class="secondary-button" href="index.html">Back to places</a>
                </div>
                <p class="section-description">${escapeHtml(place.description || "No description was provided for this place.")}</p>
                <div class="detail-list">
                    <div><strong>Host:</strong> ${escapeHtml(fullName(host))}</div>
                    <div><strong>Owner ID:</strong> ${escapeHtml(place.owner_id || "N/A")}</div>
                    <div><strong>Place ID:</strong> ${escapeHtml(place.id)}</div>
                </div>
                <div>
                    <strong>Amenities:</strong>
                    <ul class="amenities-list">
                        ${amenities.length ? amenities.map((amenity) => `<li class="amenity-pill">${escapeHtml(amenity.name || amenity)}</li>`).join("") : "<li class='muted'>No amenities listed.</li>"}
                    </ul>
                </div>
            </div>
        `;

        if (reviewAction && isAuthenticated()) {
            reviewAction.href = `add_review.html?place_id=${encodeURIComponent(place.id)}`;
            reviewAction.textContent = "Add Review";
        }

        if (reviewsContainer) {
            reviewsContainer.innerHTML = "";
        }

        if (!reviews.length) {
            reviewsContainer.appendChild(createEmptyState("No reviews yet. Be the first to leave one."));
        } else {
            const usersCache = new Map();
            for (const review of reviews) {
                let reviewerName = "Guest reviewer";
                if (review.user) {
                    reviewerName = fullName(review.user);
                } else if (review.user_name) {
                    reviewerName = review.user_name;
                } else if (review.user_id) {
                    if (!usersCache.has(review.user_id)) {
                        try {
                            const user = await apiFetch(`/users/${encodeURIComponent(review.user_id)}`);
                            usersCache.set(review.user_id, user);
                        } catch (error) {
                            usersCache.set(review.user_id, null);
                        }
                    }
                    const cachedUser = usersCache.get(review.user_id);
                    if (cachedUser) {
                        reviewerName = fullName(cachedUser);
                    }
                }
                reviewsContainer.appendChild(renderReviewCard(review, reviewerName));
            }
        }

        setStatus(pageStatus, `Loaded ${place.title}.`);
        setStatus(reviewStatus, `${reviews.length ? `${reviews.length} review${reviews.length === 1 ? "" : "s"} found.` : "This place has not received reviews yet."}`);
    } catch (error) {
        container.innerHTML = "";
        container.appendChild(createEmptyState(error.message));
        setStatus(pageStatus, error.message, "error");
        if (reviewsContainer) {
            reviewsContainer.innerHTML = "";
        }
    }
}

async function handleLoginPage() {
    const form = document.querySelector("[data-login-form]");
    const status = document.querySelector("[data-login-status]");

    if (!form) {
        return;
    }

    if (isAuthenticated()) {
        window.location.href = "index.html";
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const payload = {
            email: String(formData.get("email") || "").trim(),
            password: String(formData.get("password") || ""),
        };

        if (!payload.email || !payload.password) {
            setStatus(status, "Email and password are required.", "error");
            return;
        }

        try {
            const response = await apiFetch("/login", {
                method: "POST",
                body: payload,
            });
            setCookie(COOKIE_NAME, response.access_token);
            setStatus(status, "Login successful. Redirecting...", "info");
            window.location.href = "index.html";
        } catch (error) {
            setStatus(status, error.message, "error");
        }
    });
}

async function handleAddReviewPage() {
    if (!requireAuth("index.html")) {
        return;
    }

    const form = document.querySelector("[data-review-form]");
    const status = document.querySelector("[data-review-status]");
    const placeIdInput = document.querySelector("[data-place-id-input]");
    const placeTitle = document.querySelector("[data-place-title]");
    const placeSummary = document.querySelector("[data-place-summary]");
    const placeId = getQueryParam("place_id") || "";

    if (!form || !placeIdInput) {
        return;
    }

    placeIdInput.value = placeId;

    if (placeId) {
        try {
            const place = await apiFetch(`/places/${encodeURIComponent(placeId)}`);
            if (placeTitle) {
                placeTitle.textContent = place.title;
            }
            if (placeSummary) {
                placeSummary.textContent = `${formatPrice(place.price)} · ${getRegion(place)}`;
            }
        } catch (error) {
            setStatus(status, error.message, "error");
        }
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const payload = {
            place_id: String(formData.get("place_id") || placeId).trim(),
            text: String(formData.get("text") || "").trim(),
            rating: Number(formData.get("rating") || 5),
        };

        if (!payload.place_id) {
            setStatus(status, "A place ID is required.", "error");
            return;
        }

        if (!payload.text) {
            setStatus(status, "Please write a review comment.", "error");
            return;
        }

        try {
            await apiFetch("/reviews/", {
                method: "POST",
                body: payload,
            });
            setStatus(status, "Review added successfully. Redirecting...", "info");
            window.location.href = `place.html?place_id=${encodeURIComponent(payload.place_id)}`;
        } catch (error) {
            setStatus(status, error.message, "error");
        }
    });
}

function attachLogoutShortcut() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && window.location.hash === "#logout") {
            logout();
        }
    });
}

function initApp() {
    renderHeaderState();
    attachLogoutShortcut();

    const page = document.body?.dataset?.page;

    if (page === "login") {
        handleLoginPage();
    } else if (page === "index") {
        loadPlacesPage();
    } else if (page === "place") {
        loadPlaceDetailsPage();
    } else if (page === "add-review") {
        handleAddReviewPage();
    }
}

document.addEventListener("DOMContentLoaded", initApp);
