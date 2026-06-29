/* Conversational Map — a chat front-end over the map-features index.
 *
 * Text-first prototype: the user asks in plain language about where they are or anywhere
 * on the map; we POST to /api/context-chat, which runs the LLM tool loop server-side and
 * returns an answer. This file is the accessible shell: a disclaimer gate, a location
 * fix, a navigable transcript, an input, and a polite live region that speaks each answer.
 *
 * No heading/compass yet (v1) — answers use compass bearings. Reusing the Context Map's
 * HeadingProvider to add clock-face directions is the obvious next step. */

import { HeadingProvider } from "./HeadingProvider.js";

const API = "/api/context-chat";
const MAX_HISTORY = 12; // text turns kept client-side and sent for context

const $ = (id) => document.getElementById(id);
const heading = new HeadingProvider(); // compass → clock-face directions ("2 o'clock")

// ── Disclaimer gate ───────────────────────────────────────────────────────────
const gate = $("cv-gate");
const app = $("cv-app");
const accept = $("cv-accept");
const start = $("cv-start");

accept.addEventListener("change", () => { start.disabled = !accept.checked; });

let started = false; // app revealed + sensors permitted (gates the on-resume refresh)

start.addEventListener("click", () => {
  gate.hidden = true;
  app.hidden = false;
  started = true;
  $("cv-app-title").focus();
  // The click is the user gesture both the location prompt and the iOS compass
  // permission need. getHeading() returns null until a reading lands (and on any
  // device without a compass), so answers fall back to compass bearings cleanly.
  requestLocation();
  heading.start().catch(() => {});
});

// ── Location ──────────────────────────────────────────────────────────────────
let location_ = null; // { lat, lon } — kept current by the watch + a fresh read per question

function requestLocation() {
  if (!("geolocation" in navigator)) return;
  navigator.geolocation.getCurrentPosition(onPos, () => {}, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
  // Continuous updates as the user moves; failures are silent (we keep the last fix).
  navigator.geolocation.watchPosition(onPos, () => {}, { enableHighAccuracy: true, maximumAge: 5000, timeout: 25000 });
}
function onPos(p) {
  location_ = { lat: +p.coords.latitude.toFixed(6), lon: +p.coords.longitude.toFixed(6) };
}

// Grab a CURRENT fix right before each question, so the answer is from where the user is
// NOW — walking from a café to a bus stop must register. Falls back to the last known fix
// (or null) if a fresh read times out.
function freshLocation() {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) return resolve(location_);
    navigator.geolocation.getCurrentPosition(
      (p) => { onPos(p); resolve(location_); },
      () => resolve(location_),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 8000 },
    );
  });
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
  const loc = await freshLocation(); // answer from where they are NOW, not a stale fix
  if (loc) { const h = heading.getHeading(); if (h != null) loc.heading = Math.round(h); } // facing → clock

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        location: loc || undefined,
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

// Phone out of the pocket / screen unlocked: the OS may have suspended the GPS watch and the
// compass while the page was hidden. Re-arm both so the next question (and its clock direction)
// come from where the user is NOW, not a stale fix — the reload-to-fix bug.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible" || !started) return;
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(onPos, () => {}, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
  }
  heading.resume();
});
