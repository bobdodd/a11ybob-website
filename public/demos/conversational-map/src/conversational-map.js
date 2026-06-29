/* Conversational Map — a chat front-end over the map-features index.
 *
 * Text-first prototype: the user asks in plain language about where they are or anywhere
 * on the map; we POST to /api/context-chat, which runs the LLM tool loop server-side and
 * returns an answer. This file is the accessible shell: a disclaimer gate, a location
 * fix, a navigable transcript, an input, and a polite live region that speaks each answer.
 *
 * No heading/compass yet (v1) — answers use compass bearings. Reusing the Context Map's
 * HeadingProvider to add clock-face directions is the obvious next step. */

const API = "/api/context-chat";
const MAX_HISTORY = 12; // text turns kept client-side and sent for context

const $ = (id) => document.getElementById(id);

// ── Disclaimer gate ───────────────────────────────────────────────────────────
const gate = $("cv-gate");
const app = $("cv-app");
const accept = $("cv-accept");
const start = $("cv-start");

accept.addEventListener("change", () => { start.disabled = !accept.checked; });

start.addEventListener("click", () => {
  gate.hidden = true;
  app.hidden = false;
  $("cv-app-title").focus();
  requestLocation(); // the click is the gesture the browser needs to prompt
});

// ── Location ──────────────────────────────────────────────────────────────────
let location_ = null; // { lat, lon } or null

function requestLocation() {
  if (!("geolocation" in navigator)) return;
  const opts = { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 };
  navigator.geolocation.getCurrentPosition(onPos, () => {}, opts);
  // Keep it fresh as the user moves; failures are silent (we just keep the last fix).
  navigator.geolocation.watchPosition(onPos, () => {}, opts);
}
function onPos(p) {
  location_ = { lat: +p.coords.latitude.toFixed(6), lon: +p.coords.longitude.toFixed(6) };
}

// ── Conversation ──────────────────────────────────────────────────────────────
const form = $("cv-form");
const input = $("cv-input");
const send = $("cv-send");
const log = $("cv-log");
const status = $("cv-status");
const live = $("cv-live");

const history = []; // { role: 'user' | 'assistant', content: string }

function addMessage(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `cv-msg cv-msg--${role === "user" ? "user" : "bot"}`;
  const who = document.createElement("span");
  who.className = "cv-sr-only";
  who.textContent = role === "user" ? "You: " : "Map: ";
  const p = document.createElement("p");
  p.className = "cv-msg__text";
  p.textContent = text;
  wrap.append(who, p);
  log.append(wrap);
  wrap.scrollIntoView({ block: "nearest" });
  return wrap;
}

function setBusy(busy, note) {
  send.disabled = busy;
  input.disabled = busy;
  status.textContent = note || "";
}

// Announce in the polite sr-only region. Re-set via a tick so identical/!changed text
// still re-announces, and so it doesn't collide with the visible append.
function announce(text) {
  live.textContent = "";
  window.setTimeout(() => { live.textContent = text; }, 60);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message || send.disabled) return;

  addMessage("user", message);
  history.push({ role: "user", content: message });
  input.value = "";
  setBusy(true, "Thinking…");

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        location: location_ || undefined,
        history: history.slice(-MAX_HISTORY - 1, -1), // prior turns, excluding the one just pushed
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.error) {
      const msg = data.error || `Something went wrong (${res.status}).`;
      setBusy(false, msg);
      announce(msg);
      input.focus();
      return;
    }

    const reply = (data.reply || "").trim() || "I'm not sure how to answer that.";
    addMessage("bot", reply);
    history.push({ role: "assistant", content: reply });
    if (history.length > MAX_HISTORY * 2) history.splice(0, history.length - MAX_HISTORY * 2);
    setBusy(false, "");
    announce(reply);
    input.focus();
  } catch {
    const msg = "I couldn't reach the assistant. Check your connection and try again.";
    setBusy(false, msg);
    announce(msg);
    input.focus();
  }
});
