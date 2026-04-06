document.addEventListener("DOMContentLoaded", () => {
  const token = getAuthToken();
  checkAuthentication(token);
  setupLogout();

  const form = document.getElementById("login-form");
  if (!form) {
    return;
  }

  const errorBox = document.getElementById("error-message");
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (errorBox) {
      errorBox.textContent = "";
      errorBox.hidden = true;
    }

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !password) {
      showError("Email and password are required.");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Signing in...";
    }

    try {
      await loginUser(email, password);
      window.location.href = "index.html";
    } catch (error) {
      showError(error.message || "Login failed. Please try again.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Sign in";
      }
    }
  });

  function showError(message) {
    if (!errorBox) {
      return;
    }

    errorBox.textContent = message;
    errorBox.hidden = false;
  }
});

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
  const loginLink = document.querySelector('a.login-button[aria-current="page"]') || document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");

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

async function loginUser(email, password) {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl.replace(/\/$/, "")}/auth/login`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const responseBody = await parseJsonSafe(response);

  if (!response.ok) {
    const message =
      responseBody.message ||
      responseBody.error ||
      "Invalid credentials or server error.";
    throw new Error(message);
  }

  const token =
    responseBody.access_token ||
    responseBody.token ||
    responseBody.jwt ||
    responseBody.jwt_token;

  if (!token) {
    throw new Error("Login succeeded but token was not returned.");
  }

  setAuthCookie(token);
}

function getApiBaseUrl() {
  if (window.HBNB_API_BASE_URL) {
    return window.HBNB_API_BASE_URL;
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

function setAuthCookie(token) {
  const maxAge = 60 * 60 * 24;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
}
