/* Conversational Map — a chat front-end over the map-features index.
 *
 * The user asks (typed OR spoken) about where they are or anywhere on the map; we POST to
 * /api/context-chat (the LLM tool loop) and read the answer back. Voice INPUT goes through
 * /api/context-stt (Deepgram); spoken OUTPUT uses Web Speech, with an ARIA-live fallback for
 * devices without a voice (de-Googled phones). Accessible shell: disclaimer gate, location +
 * compass, navigable transcript, a text input, and a Speak button. */

import { HeadingProvider } from "./HeadingProvider.js";

const CHAT_API = "/api/context-chat";
const STT_API = "/api/context-stt";
const MAX_HISTORY = 12; // text turns kept client-side and sent for context

const $ = (id) => document.getElementById(id);
const heading = new HeadingProvider(); // compass → clock-face directions ("2 o'clock")

// ── Spoken output: Web Speech where usable (decided ONCE), else the ARIA live region. Same
//    channel choice as the Context Map — a de-Googled phone reports no voice and routes to
//    the live region, read by the user's own screen reader. No per-utterance fallback, so the
//    two never run together. ──
const synth = ("speechSynthesis" in window) ? window.speechSynthesis : null;
let speechOk = false;
const decideSpeech = () => { if (synth) speechOk = synth.getVoices().length > 0; };
if (synth) { decideSpeech(); if (synth.addEventListener) synth.addEventListener("voiceschanged", decideSpeech); }

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
  // This click is the user gesture the location prompt, the iOS compass, AND speech all need.
  // Speaking a line HERE (inside the gesture) primes iOS's speech engine so the later, async
  // answers are allowed to speak.
  requestLocation();
  heading.start().catch(() => {});
  speak("Ready. Ask where you are, or about anywhere on the map — type it, or use the Speak button.");
});

// ── Location ──────────────────────────────────────────────────────────────────
let location_ = null; // { lat, lon } — kept current by the watch + a fresh read per question

function requestLocation() {
  if (!("geolocation" in navigator)) return;
  navigator.geolocation.getCurrentPosition(onPos, () => {}, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
  navigator.geolocation.watchPosition(onPos, () => {}, { enableHighAccuracy: true, maximumAge: 5000, timeout: 25000 });
}
function onPos(p) {
  location_ = { lat: +p.coords.latitude.toFixed(6), lon: +p.coords.longitude.toFixed(6) };
}
// A CURRENT fix right before each question (walking from a café to a bus stop must register).
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
const speakBtn = $("cv-speak");
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
  if (speakBtn) speakBtn.disabled = busy;
  status.textContent = note || "";
}

// Speak aloud where there's a voice; otherwise set the polite live region (the screen reader
// reads it). Latest-wins (cancel) so a new answer interrupts an older one.
function speak(text) {
  if (synth && speechOk) { synth.cancel(); synth.speak(new SpeechSynthesisUtterance(text)); return; }
  live.textContent = "";
  window.setTimeout(() => { live.textContent = text; }, 60);
}

async function ask(message) {
  addMessage("user", message);
  history.push({ role: "user", content: message });
  setBusy(true, "Thinking…");
  const loc = await freshLocation();
  if (loc) { const h = heading.getHeading(); if (h != null) loc.heading = Math.round(h); } // facing → clock

  try {
    const res = await fetch(CHAT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, location: loc || undefined, history: history.slice(-MAX_HISTORY - 1, -1) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) {
      const msg = data.error || `Something went wrong (${res.status}).`;
      setBusy(false, msg); speak(msg); input.focus(); return;
    }
    const reply = (data.reply || "").trim() || "I'm not sure how to answer that.";
    addMessage("bot", reply);
    history.push({ role: "assistant", content: reply });
    if (history.length > MAX_HISTORY * 2) history.splice(0, history.length - MAX_HISTORY * 2);
    setBusy(false, "");
    speak(reply);
    input.focus();
  } catch {
    const msg = "I couldn't reach the assistant. Check your connection and try again.";
    setBusy(false, msg); speak(msg); input.focus();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message || send.disabled) return;
  input.value = "";
  ask(message);
});

// ── Voice input: tap Speak to start, tap again to stop → Deepgram → fill + send ─────────
let mediaRecorder = null, chunks = [], recording = false, micStream = null, audioCtx = null;

// Short tone cue so a blind user knows recording started / stopped (rising = on, falling = off).
function beep(freq) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.12, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
    o.start(); o.stop(audioCtx.currentTime + 0.18);
  } catch { /* audio not available — the status text still says "Listening…" */ }
}

function pickMime() {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  for (const t of types) if (window.MediaRecorder && MediaRecorder.isTypeSupported(t)) return t;
  return "";
}

async function toggleRecord() {
  if (recording) { stopRecord(); return; }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
    speak("Voice input isn't available on this device — please type your question."); return;
  }
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    speak("I need microphone access to listen. Please allow it, or type your question."); return;
  }
  chunks = [];
  const mime = pickMime();
  mediaRecorder = new MediaRecorder(micStream, mime ? { mimeType: mime } : undefined);
  mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  mediaRecorder.onstop = onRecordStop;
  mediaRecorder.start();
  recording = true;
  speakBtn.textContent = "Stop";
  speakBtn.setAttribute("aria-pressed", "true");
  status.textContent = "Listening… tap Stop when you're done.";
  beep(880);
}

function stopRecord() {
  if (!mediaRecorder || !recording) return;
  recording = false;
  speakBtn.textContent = "Speak";
  speakBtn.setAttribute("aria-pressed", "false");
  beep(440);
  mediaRecorder.stop(); // → onRecordStop
}

async function onRecordStop() {
  if (micStream) { micStream.getTracks().forEach((t) => t.stop()); micStream = null; }
  const blob = new Blob(chunks, { type: chunks[0] && chunks[0].type ? chunks[0].type : "audio/webm" });
  if (blob.size < 800) { status.textContent = "I didn't catch that — try again."; return; }
  status.textContent = "Transcribing…";
  try {
    const res = await fetch(STT_API, { method: "POST", headers: { "Content-Type": blob.type }, body: blob });
    const data = await res.json().catch(() => ({}));
    const transcript = (data.transcript || "").trim();
    if (!res.ok || data.error || !transcript) {
      const msg = data.error || "I didn't catch that — try again.";
      status.textContent = msg; speak(msg); return;
    }
    // Show + speak back what was heard (a mishear is caught by ear), then send it.
    input.value = transcript;
    speak(`Heard: ${transcript}`);
    ask(transcript);
  } catch {
    const msg = "Couldn't reach the speech service. Check your connection, or type your question.";
    status.textContent = msg; speak(msg);
  }
}

if (speakBtn) speakBtn.addEventListener("click", toggleRecord);

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
