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

// ── Keep the screen awake while the app is open — otherwise it locks mid-sentence while you
//    read or listen to an answer. The lock is auto-released when the page is hidden, so it's
//    re-acquired on return to the foreground (in the visibilitychange handler below). A web
//    page can only do this while it's the visible tab; it can't hold the screen with the phone
//    locked or in the background — that would need a native app. ──
let wakeLock = null;
async function acquireWakeLock() {
  if (wakeLock || !("wakeLock" in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => { wakeLock = null; });
  } catch { wakeLock = null; }
}

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
  acquireWakeLock(); // keep the screen on so it doesn't lock mid-answer
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

// ── Voice input: STREAMING to Deepgram ─────────────────────────────────────────
// Tap Speak; speak your question; it sends automatically when you PAUSE (Deepgram's utterance-end
// detection, which works in background noise), or tap Stop. Audio streams DIRECTLY to Deepgram over
// a WebSocket using a 30-second token minted server-side (/api/context-stt-token), so the API key
// never reaches the browser and no audio passes through our server. Diarisation + "voice locking"
// keep only the MAIN speaker (you) and drop nearby conversations.
const TOKEN_API = "/api/context-stt-token";
let recording = false, micStream = null, dgSocket = null, sttCtx = null, sttNode = null, sttSource = null;
let lockedSpeaker = null, finalWords = [];   // finalWords: [{w,sp}]; transcript = the locked speaker's words
const speakerCounts = new Map();

// Short tone cue (rising = listening, falling = stopped) so a blind user hears the state.
function beep(freq) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    o.start(); o.stop(ctx.currentTime + 0.18);
    setTimeout(() => ctx.close().catch(() => {}), 250);
  } catch { /* audio not available — the status text still cues "Listening…" */ }
}

function lockedTranscript() {
  return finalWords.filter((x) => x.sp === lockedSpeaker).map((x) => x.w).join(" ")
    .replace(/\s+([.,!?;:])/g, "$1").trim();
}

// Voice-locking (Deepgram's "background filtering" pattern): lock onto the first speaker to reach
// 3 words — the person holding the phone — and keep only their words, dropping nearby chatter that
// diarisation labels as other speakers.
function ingestWords(words) {
  for (const w of words) {
    const text = w.punctuated_word || w.word || "";
    if (!text) continue;
    const sp = (typeof w.speaker === "number") ? w.speaker : 0;
    finalWords.push({ w: text, sp });
    if (lockedSpeaker === null) {
      const c = (speakerCounts.get(sp) || 0) + 1;
      speakerCounts.set(sp, c);
      if (c >= 3) lockedSpeaker = sp;
    }
  }
}

async function toggleRecord() {
  if (recording) { stopStream(true); return; }   // manual stop = finalise + send
  await startStream();
}

async function startStream() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.AudioWorkletNode) {
    speak("Voice input isn't available on this device — please type your question."); return;
  }
  let token;
  try {
    const [tk, stream] = await Promise.all([
      fetch(TOKEN_API, { method: "POST" }).then((r) => r.json().catch(() => ({}))),
      navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } }),
    ]);
    micStream = stream;
    if (!tk || !tk.token) throw new Error((tk && tk.error) || "no speech token");
    token = tk.token;
  } catch (e) {
    if (micStream) { micStream.getTracks().forEach((t) => t.stop()); micStream = null; }
    const name = (e && e.name) || "";
    const msg = name === "NotAllowedError"
      ? "Microphone blocked for this site. Allow the microphone for a11ybob.com (the prompt, or the site permissions behind the address-bar icon — not the phone's app settings), then tap Speak again."
      : name === "NotFoundError"
      ? "No microphone was found on this device — please type your question."
      : `Couldn't start speech input (${(e && e.message) || name || "error"}). You can type your question instead.`;
    status.textContent = msg; speak(msg); return;
  }

  try {
    sttCtx = new (window.AudioContext || window.webkitAudioContext)();
    await sttCtx.audioWorklet.addModule("/demos/conversational-map/src/pcm-worklet.js");
    sttSource = sttCtx.createMediaStreamSource(micStream);
    sttNode = new AudioWorkletNode(sttCtx, "pcm-worklet");
    sttSource.connect(sttNode);
    // forward PCM frames once the socket is open (drops the first few ms before it connects)
    sttNode.port.onmessage = (e) => { if (dgSocket && dgSocket.readyState === WebSocket.OPEN) dgSocket.send(e.data); };
  } catch {
    cleanupStream();
    const m = "Couldn't start audio capture — please type your question."; status.textContent = m; speak(m); return;
  }

  const params = new URLSearchParams({
    model: "nova-3", encoding: "linear16", sample_rate: String(Math.round(sttCtx.sampleRate)), channels: "1",
    diarize: "true", interim_results: "true", utterance_end_ms: "1000", endpointing: "300",
    smart_format: "true", punctuate: "true", vad_events: "true",
  });
  lockedSpeaker = null; finalWords = []; speakerCounts.clear();
  openDeepgram(`wss://api.deepgram.com/v1/listen?${params.toString()}`, token);

  recording = true;
  speakBtn.textContent = "Stop"; speakBtn.setAttribute("aria-pressed", "true");
  status.textContent = "Listening… speak your question; it sends when you pause, or tap Stop.";
  beep(880);
}

// The temp token rides in the Sec-WebSocket-Protocol header (browsers can't set Authorization on a
// WS). Deepgram takes a JWT under the 'bearer' subprotocol and an API key under 'token'; we try
// 'bearer' and fall back to 'token' once if the socket is rejected before it ever opens.
function openDeepgram(url, token, scheme = "bearer", tried = false) {
  let opened = false;
  const ws = new WebSocket(url, [scheme, token]);
  dgSocket = ws;
  ws.binaryType = "arraybuffer";
  ws.onopen = () => { opened = true; };
  ws.onmessage = (e) => {
    let msg; try { msg = JSON.parse(e.data); } catch { return; }
    if (msg.type === "UtteranceEnd") { if (recording && lockedTranscript()) stopStream(true); return; }
    const alt = msg.channel && msg.channel.alternatives && msg.channel.alternatives[0];
    if (!alt) return;
    if (msg.is_final && alt.words && alt.words.length) ingestWords(alt.words);
    // Live feedback into the INPUT field only (not the aria-live status, which would announce every
    // word): the locked words so far + the current interim guess.
    const interim = (!msg.is_final && alt.transcript) ? alt.transcript : "";
    const shown = [lockedTranscript(), interim].filter(Boolean).join(" ").trim();
    if (shown) input.value = shown;
  };
  ws.onclose = () => {
    if (!opened && !tried) { openDeepgram(url, token, scheme === "bearer" ? "token" : "bearer", true); return; }
    if (recording) {                               // dropped while we were listening
      const t = lockedTranscript();
      if (!t) { const m = "Speech connection dropped — tap Speak to try again, or type your question."; status.textContent = m; speak(m); }
      stopStream(!!t);
    }
  };
  ws.onerror = () => { /* surfaced via onclose */ };
}

function cleanupStream() {
  try { if (sttNode) sttNode.port.onmessage = null; } catch { /* */ }
  try { if (sttSource) sttSource.disconnect(); } catch { /* */ }
  try { if (sttNode) sttNode.disconnect(); } catch { /* */ }
  try { if (sttCtx) sttCtx.close(); } catch { /* */ }
  try { if (micStream) micStream.getTracks().forEach((t) => t.stop()); } catch { /* */ }
  try {
    if (dgSocket) {
      if (dgSocket.readyState === WebSocket.OPEN) { try { dgSocket.send(JSON.stringify({ type: "CloseStream" })); } catch { /* */ } }
      dgSocket.close();
    }
  } catch { /* */ }
  sttNode = sttSource = sttCtx = micStream = dgSocket = null;
}

function stopStream(finalise) {
  if (!recording) return;
  recording = false;
  speakBtn.textContent = "Speak"; speakBtn.setAttribute("aria-pressed", "false");
  beep(440);
  const t = finalise ? lockedTranscript() : "";
  cleanupStream();
  if (finalise) {
    if (t) { input.value = t; speak(`Heard: ${t}`); ask(t); }   // a mishear is caught by ear
    else { status.textContent = "I didn't catch that — try again."; }
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
  acquireWakeLock(); // the wake lock was auto-released while hidden — take it again
});
