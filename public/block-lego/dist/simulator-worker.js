import"./chunk-OOJM4CTU.js";var p={"__init__.py":`"""
A LEGO(R) Education SPIKE(TM) Prime hub simulator.

Speaks the real hub protocol -- the one LEGO publishes at
https://lego.github.io/spike-prime-docs/ -- so a client cannot tell it apart
from hardware at the wire level, and runs the MicroPython it is sent against
a simulated driving base on a mat.

Part of the Blockly for Lego project: the simulator's primary output is a
narrated event log meant to be read aloud, not a picture of a robot.
"""

__version__ = "0.1.0"

from .robot import Robot, RobotConfig
from .world import World, default_world

__all__ = ["Robot", "RobotConfig", "World", "default_world", "__version__"]
`,"__main__.py":`"""
Command line entry point.

    python -m spike_sim                    serve a hub on ws://127.0.0.1:8765
    python -m spike_sim --run program.py   run one program and print what happened

The second form is the one to reach for while writing a code generator: it
needs no client, no browser and no hardware, and it prints the narration --
which is the same text a student will hear.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys

from . import events as ev
from .hub import HubSimulator
from .robot import Robot, RobotConfig
from .server import SimulatorServer
from .world import World, default_world

KIND_PREFIX = {
    ev.CONSOLE: "  print",
    ev.ERROR: "  ERROR",
    ev.PROGRAM: "program",
    ev.MOTOR: "  motor",
    ev.DRIVE: "  drive",
    ev.SENSOR: " sensor",
    ev.DISPLAY: "display",
    ev.SOUND: "  sound",
}


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="spike_sim",
        description="A LEGO Education SPIKE Prime hub simulator that speaks the real protocol.",
    )
    parser.add_argument("--host", default="127.0.0.1", help="address to serve on")
    parser.add_argument("--port", type=int, default=8765, help="port to serve on")
    parser.add_argument(
        "--speed", type=float, default=1.0,
        help="simulated seconds per real second (default 1.0)",
    )
    parser.add_argument("--world", help="path to a world JSON file")
    parser.add_argument(
        "--snapshot-interval", type=float, default=0.05,
        help="seconds between robot telemetry snapshots for viewers (default 0.05)",
    )
    parser.add_argument(
        "--noise", type=float, default=0.0,
        help="wheel slip, e.g. 0.02 for 2%% scatter (default 0, perfectly repeatable)",
    )
    parser.add_argument("--run", metavar="FILE", help="run one program, print the narration, exit")
    parser.add_argument("--json", action="store_true", help="print events as JSON lines")
    parser.add_argument("--quiet", action="store_true", help="do not print the narration")
    parser.add_argument(
        "--wheel-diameter", type=float, default=56.0, help="wheel diameter in mm (default 56)"
    )
    parser.add_argument(
        "--axle-track", type=float, default=160.0,
        help="distance between the drive wheels in mm (default 160)",
    )
    return parser


def make_hub(args) -> HubSimulator:
    world = World.load(args.world) if args.world else default_world()
    config = RobotConfig(
        noise=args.noise,
        wheel_diameter_mm=args.wheel_diameter,
        axle_track_mm=args.axle_track,
    )
    robot = Robot(config=config, world=world)
    return HubSimulator(robot, speed=args.speed)


def attach_printer(hub: HubSimulator, args) -> None:
    if args.quiet:
        return

    def on_event(event: ev.Event) -> None:
        if args.json:
            print(json.dumps({
                "time": round(event.sim_time, 3),
                "kind": event.kind,
                "message": event.message,
                "data": event.data,
            }), flush=True)
        else:
            prefix = KIND_PREFIX.get(event.kind, event.kind)
            print(f"[{event.sim_time:7.2f}s] {prefix} | {event.message}", flush=True)

    hub.log.subscribe(on_event)


async def run_one(args) -> int:
    hub = make_hub(args)
    attach_printer(hub, args)

    try:
        source = open(args.run, encoding="utf8").read()
    except OSError as error:
        print(f"Could not read {args.run}: {error}", file=sys.stderr)
        return 2

    await hub.start()
    await hub.load_and_run(source)
    try:
        await hub.wait_for_program(timeout=120)
    except TimeoutError as error:
        print(f"\\n{error}", file=sys.stderr)
        await hub.stop()
        return 1
    await hub.stop()

    failed = any(e.kind == ev.ERROR for e in hub.log.events)

    if args.json:
        # A final machine-readable line, so another program can assert on where
        # the robot actually ended up rather than parsing the narration.
        print(json.dumps({
            "type": "final",
            "failed": failed,
            "robot": hub.robot.snapshot(),
        }), flush=True)
    elif not args.quiet:
        print()
        print(hub.robot.describe_position())
        print(f"It travelled {ev.say_distance(hub.robot.odometer_mm)} in total.")

    return 1 if failed else 0


async def serve(args) -> int:
    hub = make_hub(args)
    attach_printer(hub, args)
    server = SimulatorServer(
        hub, host=args.host, port=args.port, snapshot_interval=args.snapshot_interval
    )

    if not args.quiet:
        # flush explicitly: Python block-buffers stdout when it is not a
        # terminal, so under a process manager or a redirect the banner would
        # otherwise sit unseen while the server looks like it never started
        print(f"SPIKE hub simulator listening on ws://{args.host}:{args.port}")
        print("  browser editor : connect a WebSocket, send COBS frames as binary messages")
        print(f"  python client  : open a plain TCP socket to {args.host}:{args.port}")
        print(f"  simulated speed: {args.speed}x")
        print("Press Ctrl+C to stop.\\n", flush=True)

    try:
        await server.serve_forever()
    except asyncio.CancelledError:
        pass
    return 0


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    coroutine = run_one(args) if args.run else serve(args)
    try:
        return asyncio.run(coroutine)
    except KeyboardInterrupt:
        print("\\nStopped.")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
`,"browser.py":`"""
Running the simulator inside a browser.

The hub is already transport-agnostic: frames in through
:meth:\`HubSimulator.receive_bytes\`, frames out through a \`\`send\`\` callback.
This module is the fourth pipe those frames can travel down \u2014 after Bluetooth,
a WebSocket and a plain socket \u2014 and the only one where the simulator and the
editor share a process.

It exists so a hosted copy of the editor can still have a robot. A browser
will not let a page reach a simulator running on the reader's own machine, so
the simulator comes to the page instead, compiled to WebAssembly and running
in a worker.

Nothing here touches the protocol, the physics or the narration: the same
\`HubSimulator\`, \`Robot\` and \`World\` run unchanged, which is the point. A robot
that behaved differently in the browser would put a sighted student watching
the screen and a blind student listening to the narration in front of two
different robots.

There are no sockets in this file, and no \`asyncio.run\`. Neither is available
in a browser, and both are the usual reason Python refuses to run in one.
"""

from __future__ import annotations

import asyncio
import json
from typing import Callable

from . import events as ev
from .hub import HubSimulator
from .robot import Robot, RobotConfig
from .telemetry import event_payload, hello_payload, snapshot_payload
from .world import World, default_world


class BrowserHub:
    """A hub wired to two callbacks instead of a socket.

    :param on_frame: called with each outgoing protocol frame, as \`\`bytes\`\`
    :param on_message: called with each JSON payload, as a \`\`str\`\`

    Both are handed across the JavaScript boundary, so they take plain types:
    JSON is serialized here rather than relying on an object converter.
    """

    def __init__(
        self,
        on_frame: Callable[[bytes], None],
        on_message: Callable[[str], None],
        *,
        speed: float = 1.0,
        snapshot_interval: float = 0.05,
        world: World | None = None,
        config: RobotConfig | None = None,
    ):
        self._on_frame = on_frame
        self._on_message = on_message
        self.snapshot_interval = snapshot_interval

        self.robot = Robot(config=config or RobotConfig(), world=world or default_world())
        self.hub = HubSimulator(self.robot, send=self._send_frame, speed=speed)
        self.hub.log.subscribe(self._send_event)

        self._snapshots: asyncio.Task | None = None

    # -- lifecycle ----------------------------------------------------------

    async def start(self) -> None:
        """Begin simulating, and say hello."""
        await self.hub.start()
        self._send_json(hello_payload(self.robot))
        if self._snapshots is None:
            self._snapshots = asyncio.ensure_future(self._snapshot_loop())

    async def stop(self) -> None:
        if self._snapshots is not None:
            snapshots, self._snapshots = self._snapshots, None
            snapshots.cancel()
            try:
                # Awaited, not just cancelled: an un-awaited cancelled task
                # prints a CancelledError to the console at teardown, which
                # reads as a fault in something that shut down correctly.
                await snapshots
            except asyncio.CancelledError:
                pass
        await self.hub.stop()

    # -- the protocol pipe --------------------------------------------------

    def receive(self, data) -> None:
        """Accept bytes from the editor.

        Anything buffer-like is accepted because what arrives from JavaScript
        is a typed array, not Python \`\`bytes\`\`.
        """
        self.hub.receive_bytes(bytes(data))

    def _send_frame(self, frame: bytes) -> None:
        self._on_frame(bytes(frame))

    # -- the narration pipe -------------------------------------------------

    def _send_event(self, event: ev.Event) -> None:
        self._send_json(event_payload(event))

    def _send_json(self, payload: dict) -> None:
        self._on_message(json.dumps(payload))

    async def _snapshot_loop(self) -> None:
        while True:
            await asyncio.sleep(self.snapshot_interval)
            self._send_json(snapshot_payload(self.robot))

    # -- simulator-only commands -------------------------------------------

    def command(self, payload: str) -> None:
        """Handle one JSON command: place, reset, press, speed, describe.

        The same set the WebSocket server accepts, so a viewer written against
        one works against the other.
        """
        try:
            command = json.loads(payload)
        except ValueError:
            return

        action = command.get("action")
        robot = self.robot

        if action == "press":
            robot.press_force_sensor(command.get("port", "E"), command.get("force", 100))
        elif action == "reset":
            robot.x = robot.config.start_x
            robot.y = robot.config.start_y
            robot.heading = robot.config.start_heading
            robot.stop_all_motors()
            robot.reset_odometer()
            self.hub.log.emit(ev.PROGRAM, "The robot was put back at its starting place.")
        elif action == "place":
            robot.x = float(command.get("x", robot.x))
            robot.y = float(command.get("y", robot.y))
            robot.heading = float(command.get("heading", robot.heading))
            self.hub.log.emit(ev.PROGRAM, f"The robot was moved. {robot.describe_position()}")
        elif action == "speed":
            self.hub.speed = max(0.1, float(command.get("value", 1.0)))
        elif action == "describe":
            self.hub.log.emit(ev.PROGRAM, robot.describe_position())


def create(on_frame, on_message, **options) -> BrowserHub:
    """Convenience entry point, easier to call across the JavaScript boundary."""
    return BrowserHub(on_frame, on_message, **options)
`,"events.py":`"""
The narrated event log.

This is not a debug log. It is the simulator's primary output for the people
this project exists for: a student who cannot see a canvas needs to *hear*
what the robot did, in the order it did it, in plain language.

Every entry therefore has to read as a sentence when spoken by a screen
reader -- no bare coordinate dumps, no abbreviations a synthesiser will
mangle, units said out loud. \`\`"drove forward 25 centimetres"\`\` is the
target register; \`\`"pose=(325.0,300.0,0.0)"\`\` is not.

Machine-readable fields ride alongside in \`\`data\`\` for anything that wants to
draw a picture instead.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Callable

# Event kinds, kept coarse so a UI can filter sensibly.
MOTOR = "motor"
DRIVE = "drive"
SENSOR = "sensor"
DISPLAY = "display"
SOUND = "sound"
PROGRAM = "program"
CONSOLE = "console"
ERROR = "error"


@dataclass
class Event:
    kind: str
    message: str
    """Plain language, meant to be spoken aloud verbatim."""
    sim_time: float
    data: dict = field(default_factory=dict)
    wall_time: float = field(default_factory=time.time)

    def __str__(self) -> str:
        return f"[{self.sim_time:7.2f}s] {self.message}"


class EventLog:
    """Collects events and fans them out to subscribers."""

    def __init__(self, clock: Callable[[], float] | None = None, keep: int = 5000):
        self._clock = clock or (lambda: 0.0)
        self._keep = keep
        self.events: list[Event] = []
        self._subscribers: list[Callable[[Event], None]] = []

    def subscribe(self, callback: Callable[[Event], None]) -> Callable[[], None]:
        """Register a listener. Returns a function that unsubscribes it."""
        self._subscribers.append(callback)

        def unsubscribe() -> None:
            if callback in self._subscribers:
                self._subscribers.remove(callback)

        return unsubscribe

    def emit(self, kind: str, message: str, **data) -> Event:
        event = Event(kind=kind, message=message, sim_time=self._clock(), data=data)
        self.events.append(event)
        if len(self.events) > self._keep:
            del self.events[: len(self.events) - self._keep]
        for callback in list(self._subscribers):
            try:
                callback(event)
            except Exception:  # a broken listener must not stop the robot
                pass
        return event

    def clear(self) -> None:
        self.events.clear()

    def transcript(self) -> str:
        """The whole run as readable text -- what you paste into a bug report."""
        return "\\n".join(str(event) for event in self.events)


# --------------------------------------------------------------------------
# phrasing helpers
# --------------------------------------------------------------------------

def say_distance(mm: float) -> str:
    """Render a distance the way a person would say it, plural agreement included."""
    if abs(mm) >= 1000:
        return _with_unit(f"{mm / 1000:.2f}", "metre")
    if abs(mm) >= 10:
        return _with_unit(f"{mm / 10:.1f}", "centimetre")
    return _with_unit(f"{mm:.0f}", "millimetre")


def _with_unit(number: str, unit: str) -> str:
    if "." in number:
        number = number.rstrip("0").rstrip(".")
    return f"{number} {unit}" if number == "1" else f"{number} {unit}s"


def say_angle(degrees: float) -> str:
    return f"{degrees:.0f} degrees"


def say_direction(degrees: float) -> str:
    """Turn a heading into a compass-free description a student can act on."""
    heading = degrees % 360
    points = [
        (0, "east"), (45, "north-east"), (90, "north"), (135, "north-west"),
        (180, "west"), (225, "south-west"), (270, "south"), (315, "south-east"),
    ]
    nearest = min(points, key=lambda p: min(abs(heading - p[0]), 360 - abs(heading - p[0])))
    return nearest[1]
`,"hub.py":`"""
The hub itself: protocol state machine, program slots, and the run loop.

:class:\`HubSimulator\` is transport-agnostic. Feed it frames with
:meth:\`receive_frame\` and it hands frames back through the \`\`send\`\` callback
you give it. That is deliberate -- the same object is driven by the WebSocket
server, by a plain TCP socket, and directly by the tests with no socket at
all, so the protocol is exercised identically in every case.
"""

from __future__ import annotations

import asyncio
import math
import traceback

from . import events as ev
from . import wire
from .robot import ColorSensor, DistanceSensor, ForceSensor, Motor, Robot
from .runtime import RuntimeContext, build_modules

TICK_SECONDS = 0.005
"""Physics step. 5ms keeps a full-speed motor inside 5 degrees per step."""

MAX_PACKET_SIZE = 244
MAX_CHUNK_SIZE = 512
"""Must be a multiple of 4 -- see the CRC alignment note in wire.info_response."""


def _student_traceback(error: BaseException) -> list[str]:
    """Render a traceback showing only the student's own program.

    An uncaught error is one of the main things a student needs read aloud, so
    it must point at a line they wrote. The raw traceback is mostly frames from
    inside the simulator, which are noise to them and actively misleading --
    the real hub would never mention them either.
    """
    frames = [
        frame
        for frame in traceback.extract_tb(error.__traceback__)
        if frame.filename == "program.py"
    ]
    lines: list[str] = []
    if frames:
        lines.append("Traceback (most recent call last):")
        for entry in traceback.format_list(frames):
            lines.extend(entry.rstrip().splitlines())
    for entry in traceback.format_exception_only(type(error), error):
        lines.extend(entry.rstrip().splitlines())
    return lines or [repr(error)]


class Slot:
    """One of the hub's twenty program slots."""

    def __init__(self):
        self.name: str | None = None
        self.source: bytes | None = None

    @property
    def empty(self) -> bool:
        return self.source is None

    def clear(self) -> None:
        self.name = None
        self.source = None


class _Upload:
    """A file transfer in progress."""

    def __init__(self, name: str, slot: int, expected_crc: int):
        self.name = name
        self.slot = slot
        self.expected_crc = expected_crc
        self.chunks: list[bytes] = []
        self.running_crc = 0

    @property
    def data(self) -> bytes:
        return b"".join(self.chunks)


class HubSimulator:
    """A SPIKE Prime hub, minus the plastic."""

    def __init__(self, robot: Robot, send=None, speed: float = 1.0, slots: int = 20):
        self.robot = robot
        self.log = robot.log
        self.speed = speed
        self._send = send or (lambda frame: None)

        self.slots = [Slot() for _ in range(slots)]
        self._upload: _Upload | None = None
        self._notification_interval_ms = 0
        self._next_notification_at = 0.0

        self.ctx = RuntimeContext(robot, console=self.send_console)
        self._program_task: asyncio.Task | None = None
        self._running_slot: int | None = None
        self._ticker: asyncio.Task | None = None
        self._rx_buffer = bytearray()

    # -- lifecycle ----------------------------------------------------------

    def set_send(self, send) -> None:
        self._send = send

    async def start(self) -> None:
        """Begin advancing simulated time."""
        if self._ticker is None:
            self._ticker = asyncio.create_task(self._tick_loop())

    async def stop(self) -> None:
        await self.stop_program()
        if self._ticker is not None:
            self._ticker.cancel()
            try:
                await self._ticker
            except asyncio.CancelledError:
                pass
            self._ticker = None

    async def _tick_loop(self) -> None:
        # An OS timer cannot reliably sleep for less than about a millisecond,
        # so above roughly 5x speed we stop asking it to. Several physics
        # steps are run per sleep instead, yielding between each one so that
        # a program awaiting the next tick still resumes step by step and
        # sleep_ms keeps its precision.
        step = TICK_SECONDS / max(self.speed, 0.001)
        steps_per_sleep = max(1, math.ceil(0.001 / step))
        interval = step * steps_per_sleep

        while True:
            await asyncio.sleep(interval)
            for _ in range(steps_per_sleep):
                self.ctx.tick(TICK_SECONDS)
                if steps_per_sleep > 1:
                    await asyncio.sleep(0)
            self._maybe_notify()

    # -- transport ----------------------------------------------------------

    def receive_bytes(self, data: bytes) -> None:
        """Accept a raw read, splitting on the frame delimiter.

        A real client may split a frame across writes or coalesce several
        into one read, so buffering is not optional here even though LEGO's
        own example client skips it.
        """
        self._rx_buffer.extend(data)
        while True:
            index = self._rx_buffer.find(0x02)
            if index < 0:
                return
            frame = bytes(self._rx_buffer[: index + 1])
            del self._rx_buffer[: index + 1]
            if len(frame) > 1:
                self.receive_frame(frame)

    def receive_frame(self, frame: bytes) -> None:
        """Handle one complete COBS frame."""
        try:
            payload = wire.unpack_frame(frame)
            request = wire.parse_request(payload)
        except Exception as error:
            self.log.emit(ev.ERROR, f"Could not decode a message from the app: {error}")
            return
        self._dispatch(request)

    def _emit(self, payload: bytes) -> None:
        self._send(wire.pack_frame(payload))

    # -- request handling ---------------------------------------------------

    def _dispatch(self, request) -> None:
        match request:
            case wire.InfoRequest():
                self._emit(
                    wire.info_response(
                        max_packet_size=MAX_PACKET_SIZE,
                        max_chunk_size=MAX_CHUNK_SIZE,
                    )
                )

            case wire.DeviceNotificationRequest(interval_ms=interval):
                self._notification_interval_ms = interval
                self._next_notification_at = self.robot.time
                self._emit(wire.status_response(0x29, True))

            case wire.ClearSlotRequest(slot=slot):
                ok = self._valid_slot(slot) and not self.slots[slot].empty
                if ok:
                    self.slots[slot].clear()
                # a real hub reports failure when the slot was already empty,
                # and LEGO's own client treats that as non-fatal
                self._emit(wire.status_response(0x47, ok))

            case wire.StartFileUploadRequest(file_name=name, slot=slot, crc=expected):
                if not self._valid_slot(slot):
                    self._emit(wire.status_response(0x0D, False))
                    return
                self._upload = _Upload(name, slot, expected)
                self.log.emit(
                    ev.PROGRAM,
                    f"The app started sending the program {name!r} to slot {slot}.",
                    slot=slot,
                    name=name,
                )
                self._emit(wire.status_response(0x0D, True))

            case wire.TransferChunkRequest(running_crc=running, payload=chunk):
                self._emit(wire.status_response(0x11, self._accept_chunk(running, chunk)))

            case wire.ProgramFlowRequest(stop=stop, slot=slot):
                self._emit(wire.status_response(0x1F, self._program_flow(stop, slot)))

            case wire.UnknownRequest(id=message_id):
                self.log.emit(
                    ev.ERROR,
                    f"The app sent message 0x{message_id:02X}, which the simulator "
                    f"does not implement yet.",
                    message_id=message_id,
                )

    def _valid_slot(self, slot: int) -> bool:
        return 0 <= slot < len(self.slots)

    def _accept_chunk(self, running_crc: int, chunk: bytes) -> bool:
        upload = self._upload
        if upload is None:
            self.log.emit(ev.ERROR, "A program chunk arrived before the upload started.")
            return False

        upload.running_crc = wire.crc(chunk, upload.running_crc)
        if upload.running_crc != running_crc:
            self.log.emit(
                ev.ERROR,
                "A program chunk was corrupted in transfer and was rejected.",
                expected=running_crc,
                actual=upload.running_crc,
            )
            self._upload = None
            return False

        upload.chunks.append(chunk)

        if upload.running_crc == upload.expected_crc:
            slot = self.slots[upload.slot]
            slot.name = upload.name
            slot.source = upload.data
            self.log.emit(
                ev.PROGRAM,
                f"The program {upload.name!r} arrived safely in slot {upload.slot}, "
                f"{len(upload.data)} bytes.",
                slot=upload.slot,
                size=len(upload.data),
            )
            self._upload = None
        return True

    def _program_flow(self, stop: bool, slot: int) -> bool:
        if stop:
            asyncio.ensure_future(self.stop_program())
            return True
        if not self._valid_slot(slot) or self.slots[slot].empty:
            self.log.emit(ev.ERROR, f"Slot {slot} is empty, so there is nothing to run.")
            return False
        asyncio.ensure_future(self.run_program(slot))
        return True

    # -- running programs ---------------------------------------------------

    async def run_program(self, slot: int) -> None:
        await self.stop_program()
        source = self.slots[slot].source
        if source is None:
            return

        self._running_slot = slot
        self.ctx.pending_runloops.clear()
        self.log.emit(
            ev.PROGRAM,
            f"The program in slot {slot} started running.",
            slot=slot,
        )
        self._emit(wire.program_flow_notification(stop=False))
        self._program_task = asyncio.create_task(self._execute(source.decode("utf8")))

    async def stop_program(self) -> None:
        task = self._program_task
        if task is None or task.done():
            self._program_task = None
            return
        task.cancel()
        self.ctx.cancel_waiters()
        try:
            await task
        except asyncio.CancelledError:
            pass
        self._program_task = None

    async def _execute(self, source: str) -> None:
        modules = build_modules(self.ctx)
        namespace = {"__name__": "__main__", "print": self._program_print}

        import sys

        installed = {}
        for name, module in modules.items():
            installed[name] = sys.modules.get(name)
            sys.modules[name] = module

        outcome = "finished"
        try:
            exec(compile(source, "program.py", "exec"), namespace)
            pending = list(self.ctx.pending_runloops)
            self.ctx.pending_runloops.clear()
            if pending:
                await asyncio.gather(*pending)
        except asyncio.CancelledError:
            self.log.emit(ev.PROGRAM, "The program was stopped.")
            outcome = "cancelled"
            raise
        except NotImplementedError as error:
            outcome = "error"
            self.send_console(f"Unsupported: {error}")
            self.log.emit(
                ev.ERROR,
                f"The program used something the simulator does not have. {error}",
            )
        except BaseException as error:
            outcome = "error"
            lines = _student_traceback(error)
            for line in lines:
                self.send_console(line)
            self.log.emit(ev.ERROR, f"The program stopped because of an error. {lines[-1]}")
        finally:
            for name, previous in installed.items():
                if previous is None:
                    sys.modules.pop(name, None)
                else:
                    sys.modules[name] = previous

            self.robot.stop_all_motors()
            self._running_slot = None
            if outcome == "finished":
                self.log.emit(ev.PROGRAM, "The program finished.")
            elif outcome == "error":
                self.log.emit(ev.PROGRAM, "The program stopped early because of that error.")
            self._emit(wire.program_flow_notification(stop=True))

    def _program_print(self, *args, sep=" ", end="\\n", **_kwargs) -> None:
        text = sep.join(str(a) for a in args)
        self.send_console(text)

    def send_console(self, text: str) -> None:
        """Push one line of program output to the client, and narrate it."""
        self.log.emit(ev.CONSOLE, f"The program printed: {text}", text=text)
        self._emit(wire.console_notification(text + "\\n"))

    # -- telemetry ----------------------------------------------------------

    def _maybe_notify(self) -> None:
        if not self._notification_interval_ms:
            return
        if self.robot.time < self._next_notification_at:
            return
        self._next_notification_at = self.robot.time + self._notification_interval_ms / 1000.0
        self._emit(wire.device_notification(self._device_entries()))

    def _device_entries(self) -> list[bytes]:
        from .robot import PORT_INDEX

        entries = [
            wire.battery_entry(self.robot.config.battery_percent),
            wire.imu_entry(
                face_up=0,
                yaw_face=0,
                yaw=int(self.robot.yaw * 10),
                pitch=int(self.robot.pitch * 10),
                roll=int(self.robot.roll * 10),
                accel=(0, 0, 1000),
                gyro=(0, 0, 0),
            ),
            wire.matrix_5x5_entry(self.robot.display),
        ]
        for letter, device in self.robot.ports.items():
            index = PORT_INDEX[letter]
            if isinstance(device, Motor):
                entries.append(
                    wire.motor_entry(
                        port=index,
                        device_type=device.device_type,
                        absolute_position=device.absolute_position,
                        power=device.power,
                        speed=int(device.velocity / 10.5),
                        position=int(device.relative_position),
                    )
                )
            elif isinstance(device, ColorSensor):
                entries.append(
                    wire.color_entry(port=index, color=device.color, rgb=device.rgb)
                )
            elif isinstance(device, DistanceSensor):
                entries.append(
                    wire.distance_entry(port=index, distance_mm=device.distance_mm)
                )
            elif isinstance(device, ForceSensor):
                entries.append(
                    wire.force_entry(
                        port=index, value=device.force, pressed=device.pressed
                    )
                )
        return entries

    # -- convenience for tests and the CLI ----------------------------------

    async def load_and_run(self, source: str, slot: int = 0) -> None:
        """Skip the wire and run a program directly. Used by tests."""
        self.slots[slot].name = "program.py"
        self.slots[slot].source = source.encode("utf8")
        await self.run_program(slot)

    async def wait_for_program(self, timeout: float = 30.0) -> None:
        """Wait until the running program finishes."""
        task = self._program_task
        if task is None:
            return
        try:
            await asyncio.wait_for(asyncio.shield(task), timeout=timeout)
        except asyncio.CancelledError:
            pass
        except TimeoutError:
            await self.stop_program()
            raise TimeoutError(
                f"The program was still running after {timeout} simulated-real seconds."
            )
`,"robot.py":`"""
The simulated robot: motors, sensors, and differential-drive kinematics.

Design bias: *predictability over realism*. When a student's program says
"turn 90 degrees" the robot turns 90 degrees. Real hardware has backlash,
wheel slip and battery sag, and a simulator that reproduced all of it would
teach students to distrust their own programs. Noise is available behind a
flag (\`\`RobotConfig.noise\`\`) for when you want to check a program is robust,
but it is off by default.

Frames: the robot's own frame is +x forward, +y to its left. World frame is
the one described in \`\`world.py\`\`.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass, field

from . import events as ev
from .world import COLOR_NAMES, COLOR_PROPERTIES, UNKNOWN, World, default_world

# Device type ids as reported over the wire. Cosmetic for the simulator, but
# a client may switch on them, so they should look like the real thing.
MOTOR_MEDIUM = 48
MOTOR_LARGE = 49
MOTOR_ANGULAR_MEDIUM = 75
MOTOR_ANGULAR_LARGE = 76
COLOR_SENSOR = 61
DISTANCE_SENSOR = 62
FORCE_SENSOR = 63
MATRIX_3X3 = 64

PORTS = ("A", "B", "C", "D", "E", "F")
PORT_INDEX = {letter: index for index, letter in enumerate(PORTS)}


@dataclass
class Motor:
    port: str
    device_type: int = MOTOR_LARGE
    reversed: bool = False

    position: float = 0.0
    """Cumulative shaft angle in degrees, signed, never wrapped."""
    relative_zero: float = 0.0
    target_velocity: float = 0.0
    velocity: float = 0.0
    stall_torque_ratio: float = 0.0

    limit: float | None = None
    """Stop exactly here, then clear. Set by run_for_degrees and friends.

    Clamping inside the tick rather than letting the motor overshoot and
    snapping it back is what makes "turn 90 degrees" mean 90 degrees. An
    overshoot of one tick at full speed is ~10 degrees, which on a 56mm wheel
    is 5mm of drift per move -- enough to lose a line-following program over
    a few segments, and enough to make a student doubt a correct block.
    """
    limit_direction: int = 1

    @property
    def relative_position(self) -> float:
        return self.position - self.relative_zero

    @property
    def absolute_position(self) -> int:
        """Shaft angle folded into -180..179, as the real hub reports it."""
        return int(((self.position + 180) % 360) - 180)

    @property
    def power(self) -> int:
        return int(max(-100, min(100, self.target_velocity / 10.5)))


@dataclass
class ColorSensor:
    port: str
    device_type: int = COLOR_SENSOR
    forward_mm: float = 70.0
    lateral_mm: float = 0.0
    color: int = UNKNOWN
    reflection: int = 0
    rgb: tuple[int, int, int] = (0, 0, 0)


@dataclass
class DistanceSensor:
    port: str
    device_type: int = DISTANCE_SENSOR
    forward_mm: float = 80.0
    lateral_mm: float = 0.0
    max_range_mm: float = 2000.0
    distance_mm: int = -1


@dataclass
class ForceSensor:
    port: str
    device_type: int = FORCE_SENSOR
    force: int = 0
    pressed: bool = False


@dataclass
class RobotConfig:
    """Physical description of the robot. Matches a typical two-motor driving base."""

    wheel_diameter_mm: float = 56.0
    axle_track_mm: float = 160.0
    """Distance between the drive wheels.

    160mm is not an arbitrary default. A SPIKE large angular motor puts its
    axle on the body axis, so two of them facing outwards need 60mm of body
    each plus a 12mm shaft: below about 144mm the motor bodies would have to
    pass through one another. The 3D model is what caught this -- the earlier
    112mm default described a robot nobody could build.

    Measure your own robot and pass --axle-track; this is only a sane start.
    """
    body_radius_mm: float = 90.0

    left_motor: str = "A"
    right_motor: str = "B"
    left_reversed: bool = True
    right_reversed: bool = False

    max_speed_dps: float = 1050.0
    """Roughly a SPIKE large angular motor at full power."""
    acceleration_dps2: float = 3000.0

    start_x: float = 300.0
    start_y: float = 300.0
    start_heading: float = 0.0

    noise: float = 0.0
    """0 disables noise. 0.02 gives about 2% wheel-slip scatter."""

    battery_percent: int = 100


class Robot:
    """A driving base on a mat, advanced by repeated \`\`tick\`\` calls."""

    def __init__(
        self,
        config: RobotConfig | None = None,
        world: World | None = None,
        log: ev.EventLog | None = None,
    ):
        self.config = config or RobotConfig()
        self.world = world or default_world()
        self.time = 0.0
        self.log = log or ev.EventLog(clock=lambda: self.time)

        self.x = self.config.start_x
        self.y = self.config.start_y
        self.heading = self.config.start_heading

        self.ports: dict[str, object] = {letter: None for letter in PORTS}
        self.ports[self.config.left_motor] = Motor(
            port=self.config.left_motor, reversed=self.config.left_reversed
        )
        self.ports[self.config.right_motor] = Motor(
            port=self.config.right_motor, reversed=self.config.right_reversed
        )
        self.ports["C"] = ColorSensor(port="C")
        self.ports["D"] = DistanceSensor(port="D")
        self.ports["E"] = ForceSensor(port="E")

        # 5x5 hub display, row-major, values 0-100
        self.display: list[int] = [0] * 25
        self.hub_light: int = UNKNOWN
        self.yaw = 0.0
        self.pitch = 0.0
        self.roll = 0.0
        self.yaw_zero = 0.0

        self._last_positions = {
            self.config.left_motor: 0.0,
            self.config.right_motor: 0.0,
        }
        self._odometer = 0.0
        self._last_reported_color = None
        self._last_blocked = False
        self._rng = random.Random(20260910)

        self._sample_sensors()

    # -- port access --------------------------------------------------------

    def motor(self, port: str) -> Motor:
        device = self.ports.get(port)
        if not isinstance(device, Motor):
            raise RuntimeError(
                f"No motor on port {port}. "
                f"Ports in use: {self.describe_ports()}"
            )
        return device

    def device(self, port: str, expected: type):
        device = self.ports.get(port)
        if not isinstance(device, expected):
            raise RuntimeError(
                f"No {expected.__name__} on port {port}. "
                f"Ports in use: {self.describe_ports()}"
            )
        return device

    def describe_ports(self) -> str:
        parts = []
        for letter in PORTS:
            device = self.ports[letter]
            if device is not None:
                parts.append(f"{letter}={type(device).__name__}")
        return ", ".join(parts) if parts else "none"

    @property
    def drive_motors(self) -> tuple[Motor, Motor]:
        return (
            self.motor(self.config.left_motor),
            self.motor(self.config.right_motor),
        )

    # -- simulation ---------------------------------------------------------

    def tick(self, dt: float) -> None:
        """Advance the simulation by \`\`dt\`\` seconds."""
        self.time += dt
        for device in self.ports.values():
            if isinstance(device, Motor):
                self._tick_motor(device, dt)
        self._tick_kinematics()
        self._sample_sensors()

    def _tick_motor(self, motor: Motor, dt: float) -> None:
        # first-order approach to the requested speed, so a stop is not
        # instantaneous and timing roughly matches hardware
        delta = motor.target_velocity - motor.velocity
        max_change = self.config.acceleration_dps2 * dt
        motor.velocity += max(-max_change, min(max_change, delta))
        motor.position += motor.velocity * dt

        if motor.limit is not None:
            overshot = (motor.position - motor.limit) * motor.limit_direction >= 0
            if overshot:
                motor.position = motor.limit
                motor.velocity = 0.0
                motor.target_velocity = 0.0
                motor.limit = None

    def _tick_kinematics(self) -> None:
        left, right = self.drive_motors
        config = self.config

        left_delta = left.position - self._last_positions[left.port]
        right_delta = right.position - self._last_positions[right.port]
        self._last_positions[left.port] = left.position
        self._last_positions[right.port] = right.position

        if config.noise:
            scatter = config.noise
            left_delta *= 1 + self._rng.uniform(-scatter, scatter)
            right_delta *= 1 + self._rng.uniform(-scatter, scatter)

        # a reversed motor still reports its own shaft angle; the sign flip
        # only applies to how the wheel pushes the robot
        if left.reversed:
            left_delta = -left_delta
        if right.reversed:
            right_delta = -right_delta

        circumference = math.pi * config.wheel_diameter_mm
        left_mm = left_delta / 360.0 * circumference
        right_mm = right_delta / 360.0 * circumference

        forward = (left_mm + right_mm) / 2.0
        turn = (right_mm - left_mm) / config.axle_track_mm  # radians

        heading_rad = math.radians(self.heading)
        mid_heading = heading_rad + turn / 2.0
        new_x = self.x + forward * math.cos(mid_heading)
        new_y = self.y + forward * math.sin(mid_heading)

        if self.world.blocked(new_x, new_y, config.body_radius_mm):
            if not self._last_blocked:
                self._last_blocked = True
                self.log.emit(
                    ev.DRIVE,
                    "The robot bumped into something and stopped moving.",
                    x=round(self.x, 1),
                    y=round(self.y, 1),
                )
            # rotation in place is still allowed while pinned against a wall
            self.heading = math.degrees(heading_rad + turn) % 360
            self.yaw = (self.heading - self.yaw_zero) % 360
            return

        self._last_blocked = False
        self.x, self.y = new_x, new_y
        self.heading = math.degrees(heading_rad + turn) % 360
        self.yaw = (self.heading - self.yaw_zero) % 360
        self._odometer += abs(forward)

    def _sample_sensors(self) -> None:
        for device in self.ports.values():
            if isinstance(device, ColorSensor):
                world_x, world_y = self.point_in_world(device.forward_mm, device.lateral_mm)
                device.color, device.reflection, device.rgb = self.world.sample(
                    world_x, world_y
                )
                if device.color != self._last_reported_color:
                    self._last_reported_color = device.color
                    name = COLOR_NAMES.get(device.color, "something")
                    # A reading well away from the colour's usual brightness
                    # means the sensor is straddling an edge. Saying "black,
                    # reflecting 46 percent" invites a student to distrust the
                    # narration; saying it is on an edge is both true and useful.
                    canonical = COLOR_PROPERTIES.get(
                        device.color, ((0, 0, 0), device.reflection)
                    )[1]
                    on_edge = abs(device.reflection - canonical) > 10
                    if on_edge:
                        # an in-between reading only ever comes from straddling
                        # a line edge, so name that rather than the colour
                        message = (
                            f"The colour sensor is on the edge of a line, "
                            f"reflecting {device.reflection} percent."
                        )
                    else:
                        message = (
                            f"The colour sensor now sees {name}, "
                            f"reflecting {device.reflection} percent."
                        )
                    self.log.emit(
                        ev.SENSOR,
                        message,
                        port=device.port,
                        color=device.color,
                        reflection=device.reflection,
                        on_edge=on_edge,
                    )
            elif isinstance(device, DistanceSensor):
                world_x, world_y = self.point_in_world(device.forward_mm, device.lateral_mm)
                distance = self.world.raycast(
                    world_x, world_y, self.heading, device.max_range_mm
                )
                device.distance_mm = -1 if math.isinf(distance) else int(distance)

    def point_in_world(self, forward_mm: float, lateral_mm: float) -> tuple[float, float]:
        """Convert a point in the robot's frame to world coordinates."""
        heading_rad = math.radians(self.heading)
        cos_h, sin_h = math.cos(heading_rad), math.sin(heading_rad)
        return (
            self.x + forward_mm * cos_h - lateral_mm * sin_h,
            self.y + forward_mm * sin_h + lateral_mm * cos_h,
        )

    # -- actions ------------------------------------------------------------

    def set_motor_velocity(self, port: str, velocity: float) -> None:
        motor = self.motor(port)
        motor.target_velocity = max(
            -self.config.max_speed_dps, min(self.config.max_speed_dps, velocity)
        )

    def stop_motor(self, port: str) -> None:
        motor = self.motor(port)
        motor.target_velocity = 0.0
        motor.velocity = 0.0

    def stop_all_motors(self) -> None:
        for device in self.ports.values():
            if isinstance(device, Motor):
                device.target_velocity = 0.0
                device.velocity = 0.0

    def press_force_sensor(self, port: str, force: int = 100) -> None:
        """Simulate a person pressing the force sensor."""
        sensor = self.device(port, ForceSensor)
        sensor.force = max(0, min(100, force))
        sensor.pressed = sensor.force > 0
        self.log.emit(
            ev.SENSOR,
            f"The force sensor on port {port} was pressed."
            if sensor.pressed
            else f"The force sensor on port {port} was released.",
            port=port,
            force=sensor.force,
        )

    def reset_odometer(self) -> None:
        self._odometer = 0.0

    @property
    def odometer_mm(self) -> float:
        return self._odometer

    # -- reporting ----------------------------------------------------------

    def describe_position(self) -> str:
        return (
            f"The robot is {ev.say_distance(self.x)} across and "
            f"{ev.say_distance(self.y)} up the mat, facing {ev.say_direction(self.heading)}."
        )

    def snapshot(self) -> dict:
        """Machine-readable state, for a viewer that wants to draw the mat."""
        motors = {}
        sensors = {}
        for letter, device in self.ports.items():
            if isinstance(device, Motor):
                motors[letter] = {
                    "position": round(device.position, 2),
                    "relative_position": round(device.relative_position, 2),
                    "velocity": round(device.velocity, 1),
                    "power": device.power,
                }
            elif isinstance(device, ColorSensor):
                sensors[letter] = {
                    "type": "color",
                    "color": device.color,
                    "color_name": COLOR_NAMES.get(device.color, "unknown"),
                    "reflection": device.reflection,
                    "rgb": list(device.rgb),
                }
            elif isinstance(device, DistanceSensor):
                sensors[letter] = {"type": "distance", "distance_mm": device.distance_mm}
            elif isinstance(device, ForceSensor):
                sensors[letter] = {
                    "type": "force",
                    "force": device.force,
                    "pressed": device.pressed,
                }
        return {
            "time": round(self.time, 3),
            "pose": {
                "x": round(self.x, 1),
                "y": round(self.y, 1),
                "heading": round(self.heading, 1),
            },
            "odometer_mm": round(self._odometer, 1),
            "motors": motors,
            "sensors": sensors,
            "display": list(self.display),
            "battery": self.config.battery_percent,
            "described": self.describe_position(),
        }
`,"runtime/__init__.py":`"""SPIKE Python API modules, bound to a simulated robot."""

from .api import RuntimeContext, build_modules

__all__ = ["RuntimeContext", "build_modules"]
`,"runtime/api.py":`"""
The SPIKE(TM) Prime Python API, implemented against the simulated robot.

These are the modules an uploaded program imports -- \`\`runloop\`\`, \`\`hub\`\`,
\`\`motor\`\`, \`\`motor_pair\`\`, \`\`color_sensor\`\`, \`\`distance_sensor\`\`,
\`\`force_sensor\`\`, \`\`color\`\`, \`\`app\`\`. They are built as real module objects
bound to a live :class:\`RuntimeContext\` and installed into \`\`sys.modules\`\`
only while a program runs.

Two deliberate divergences from hardware, both documented in the README:

1. \`\`runloop.run()\`\` records the coroutines it is given rather than blocking.
   The hub core awaits them after the program body finishes executing. The
   observable difference is that any statement placed *after* \`\`runloop.run()\`\`
   runs before the loop rather than after it -- in practice nothing is.

2. Anything the simulator does not model raises \`\`NotImplementedError\`\` with
   the API name in the message, rather than quietly returning a default. A
   silent stub would let a block generate code that passes here and fails on
   the real hub, which is the one failure mode this tool exists to prevent.
"""

from __future__ import annotations

import asyncio
import math
import types

from .. import events as ev
from ..robot import (
    PORTS,
    PORT_INDEX,
    ColorSensor,
    DistanceSensor,
    ForceSensor,
    Robot,
)
from ..world import COLOR_NAMES

# how long the hub takes to scroll one character across the 5x5 display
CHAR_DURATION_S = 0.4


class RuntimeContext:
    """Bridges the SPIKE API to the robot and the simulation clock."""

    def __init__(self, robot: Robot, console=None):
        self.robot = robot
        self.console = console or (lambda text: None)
        self.pending_runloops: list = []
        self._waiters: list[asyncio.Future] = []

    # -- clock ------------------------------------------------------------

    def tick(self, dt: float) -> None:
        self.robot.tick(dt)
        waiters, self._waiters = self._waiters, []
        for future in waiters:
            if not future.done():
                future.set_result(None)

    async def next_tick(self) -> None:
        future = asyncio.get_running_loop().create_future()
        self._waiters.append(future)
        await future

    async def wait_until(self, predicate) -> None:
        while not predicate():
            await self.next_tick()

    async def sleep(self, seconds: float) -> None:
        target = self.robot.time + seconds
        await self.wait_until(lambda: self.robot.time >= target)

    def cancel_waiters(self) -> None:
        for future in self._waiters:
            if not future.done():
                future.cancel()
        self._waiters.clear()

    # -- helpers ----------------------------------------------------------

    def port_letter(self, port) -> str:
        """Accept either a port constant (0-5) or a letter."""
        if isinstance(port, str) and port.upper() in PORT_INDEX:
            return port.upper()
        if isinstance(port, int) and 0 <= port < len(PORTS):
            return PORTS[port]
        raise RuntimeError(
            f"{port!r} is not a port. Use port.A through port.F."
        )

    def log(self, kind: str, message: str, **data):
        return self.robot.log.emit(kind, message, **data)


def _not_implemented(name: str):
    def stub(*args, **kwargs):
        raise NotImplementedError(
            f"{name} is not simulated yet. "
            f"Add it to spike_sim/runtime/api.py, or avoid it in generated blocks."
        )

    return stub


def _module(name: str, **attributes) -> types.ModuleType:
    module = types.ModuleType(name)
    for key, value in attributes.items():
        setattr(module, key, value)
    return module


def _namespace(**attributes):
    """A simple attribute bag, standing in for the hub's sub-objects."""
    return types.SimpleNamespace(**attributes)


def build_modules(ctx: RuntimeContext) -> dict[str, types.ModuleType]:
    """Construct every module an uploaded program may import."""
    robot = ctx.robot

    # -- runloop ----------------------------------------------------------

    def run(*coroutines):
        """Record coroutines; the hub core awaits them once the body is done."""
        ctx.pending_runloops.extend(coroutines)

    async def sleep_ms(milliseconds: int):
        await ctx.sleep(milliseconds / 1000.0)

    async def until(predicate, timeout_ms: int = 0):
        deadline = robot.time + (timeout_ms / 1000.0 if timeout_ms else math.inf)
        await ctx.wait_until(lambda: predicate() or robot.time >= deadline)

    runloop = _module("runloop", run=run, sleep_ms=sleep_ms, until=until)

    # -- motor ------------------------------------------------------------

    async def motor_run_for_degrees(port, degrees, velocity=360, **_kwargs):
        letter = ctx.port_letter(port)
        target_motor = robot.motor(letter)
        direction = 1 if degrees >= 0 else -1
        target = target_motor.position + degrees
        target_motor.limit = target
        target_motor.limit_direction = direction
        robot.set_motor_velocity(letter, abs(velocity) * direction)
        await ctx.wait_until(lambda: target_motor.limit is None)
        ctx.log(
            ev.MOTOR,
            f"Motor {letter} turned {ev.say_angle(abs(degrees))} "
            f"{'forward' if direction > 0 else 'backward'}.",
            port=letter,
            degrees=degrees,
        )

    async def motor_run_for_time(port, duration, velocity=360, **_kwargs):
        letter = ctx.port_letter(port)
        robot.set_motor_velocity(letter, velocity)
        await ctx.sleep(duration / 1000.0)
        robot.stop_motor(letter)
        ctx.log(
            ev.MOTOR,
            f"Motor {letter} ran for {duration / 1000:.1f} seconds.",
            port=letter,
            duration_ms=duration,
        )

    def motor_run(port, velocity, **_kwargs):
        letter = ctx.port_letter(port)
        robot.set_motor_velocity(letter, velocity)
        ctx.log(
            ev.MOTOR,
            f"Motor {letter} started turning at {abs(velocity):.0f} degrees per second.",
            port=letter,
            velocity=velocity,
        )

    def motor_stop(port, **_kwargs):
        letter = ctx.port_letter(port)
        robot.stop_motor(letter)
        ctx.log(ev.MOTOR, f"Motor {letter} stopped.", port=letter)

    motor = _module(
        "motor",
        run=motor_run,
        run_for_degrees=motor_run_for_degrees,
        run_for_time=motor_run_for_time,
        run_to_relative_position=_not_implemented("motor.run_to_relative_position"),
        run_to_absolute_position=_not_implemented("motor.run_to_absolute_position"),
        stop=motor_stop,
        relative_position=lambda port: int(robot.motor(ctx.port_letter(port)).relative_position),
        absolute_position=lambda port: robot.motor(ctx.port_letter(port)).absolute_position,
        velocity=lambda port: int(robot.motor(ctx.port_letter(port)).velocity),
        reset_relative_position=lambda port, position=0: setattr(
            robot.motor(ctx.port_letter(port)),
            "relative_zero",
            robot.motor(ctx.port_letter(port)).position - position,
        ),
        COAST=0,
        BRAKE=1,
        HOLD=2,
        CLOCKWISE=0,
        COUNTERCLOCKWISE=1,
    )

    # -- motor_pair -------------------------------------------------------

    pairs: dict[int, tuple[str, str]] = {}

    def pair(pair_id, left_port, right_port):
        pairs[pair_id] = (ctx.port_letter(left_port), ctx.port_letter(right_port))

    def _pair_ports(pair_id) -> tuple[str, str]:
        if pair_id not in pairs:
            # fall back to the configured driving base, which is what a
            # student almost always means
            return robot.config.left_motor, robot.config.right_motor
        return pairs[pair_id]

    def _steering_to_velocities(steering: int, velocity: float) -> tuple[float, float]:
        """LEGO steering: 0 straight, +100 spins right, -100 spins left."""
        steering = max(-100, min(100, steering))
        if steering >= 0:
            return velocity, velocity * (1 - 2 * steering / 100)
        return velocity * (1 + 2 * steering / 100), velocity

    def _apply_wheel_velocities(left_port, right_port, left_v, right_v):
        left_motor = robot.motor(left_port)
        right_motor = robot.motor(right_port)
        robot.set_motor_velocity(left_port, -left_v if left_motor.reversed else left_v)
        robot.set_motor_velocity(right_port, -right_v if right_motor.reversed else right_v)

    # A proportional line-follower calls move() every 20ms with a slightly
    # different steering value. Narrating each call buries the student in
    # hundreds of identical sentences, so a repeated command becomes a
    # periodic progress report instead of a fresh announcement.
    PROGRESS_INTERVAL_S = 3.0
    STEERING_STEP = 25
    VELOCITY_STEP = 50

    last_command: dict = {"time": None, "steering": None, "velocity": None}

    def _command_is_new(steering: float, velocity: float) -> bool:
        previous = last_command
        if previous["steering"] is None:
            return True
        return (
            abs(steering - previous["steering"]) >= STEERING_STEP
            or abs(velocity - previous["velocity"]) >= VELOCITY_STEP
        )

    def _narrate_command(steering: float, velocity: float, fresh_message: str, **data):
        is_new = _command_is_new(steering, velocity)
        due = (
            last_command["time"] is None
            or robot.time - last_command["time"] >= PROGRESS_INTERVAL_S
        )
        if not (is_new or due):
            return

        last_command.update(time=robot.time, steering=steering, velocity=velocity)
        message = fresh_message if is_new else f"Still driving. {robot.describe_position()}"
        ctx.log(ev.DRIVE, message, steering=steering, velocity=velocity, **data)

    def pair_move(pair_id, steering=0, *, velocity=360, **_kwargs):
        left_port, right_port = _pair_ports(pair_id)
        left_v, right_v = _steering_to_velocities(steering, velocity)
        _apply_wheel_velocities(left_port, right_port, left_v, right_v)

        if steering == 0:
            message = "The robot started driving straight."
        else:
            side = "right" if steering > 0 else "left"
            message = f"The robot started curving to the {side}."
        _narrate_command(steering, velocity, message)

    def pair_move_tank(pair_id, left_velocity, right_velocity, **_kwargs):
        left_port, right_port = _pair_ports(pair_id)
        _apply_wheel_velocities(left_port, right_port, left_velocity, right_velocity)
        message = (
            f"The robot started driving, left wheel {left_velocity:.0f}, "
            f"right wheel {right_velocity:.0f} degrees per second."
        )
        _narrate_command(
            left_velocity - right_velocity,
            max(abs(left_velocity), abs(right_velocity)),
            message,
            left=left_velocity,
            right=right_velocity,
        )

    def pair_stop(pair_id, **_kwargs):
        left_port, right_port = _pair_ports(pair_id)
        robot.stop_motor(left_port)
        robot.stop_motor(right_port)
        last_command.update(time=None, steering=None, velocity=None)
        ctx.log(ev.DRIVE, "The robot stopped.")

    async def _move_wheels_for_degrees(left_port, right_port, left_v, right_v, degrees):
        """Drive both wheels until the faster one has turned \`\`degrees\`\`."""
        left_motor = robot.motor(left_port)
        right_motor = robot.motor(right_port)

        faster = max(abs(left_v), abs(right_v))
        if faster == 0 or degrees == 0:
            return
        # scale each wheel's travel so they finish together
        left_travel = degrees * (left_v / faster)
        right_travel = degrees * (right_v / faster)

        for motor_obj, port_letter, travel, velocity in (
            (left_motor, left_port, left_travel, left_v),
            (right_motor, right_port, right_travel, right_v),
        ):
            shaft_travel = -travel if motor_obj.reversed else travel
            direction = 1 if shaft_travel >= 0 else -1
            # magnitude comes from the steering mix, sign from which way this
            # shaft actually has to turn -- taking the sign from \`velocity\`
            # instead drives the motor away from its target when \`degrees\` is
            # negative, and the move never finishes
            shaft_velocity = abs(velocity) * direction
            motor_obj.limit = motor_obj.position + shaft_travel
            motor_obj.limit_direction = direction
            robot.set_motor_velocity(port_letter, shaft_velocity)

        await ctx.wait_until(
            lambda: left_motor.limit is None and right_motor.limit is None
        )

    def _narrate_move(before, **data):
        """Describe a finished move as a person would: a drive, a turn, or a curve."""
        x0, y0, heading0 = before
        travelled = math.hypot(robot.x - x0, robot.y - y0)
        turned = (robot.heading - heading0 + 180) % 360 - 180
        side = "left" if turned > 0 else "right"

        if travelled < 5 and abs(turned) >= 3:
            message = (
                f"The robot turned {ev.say_angle(abs(turned))} to the {side}, "
                f"and now faces {ev.say_direction(robot.heading)}."
            )
        elif abs(turned) >= 3:
            message = (
                f"The robot drove {ev.say_distance(travelled)} in a curve to the "
                f"{side}. {robot.describe_position()}"
            )
        else:
            message = f"The robot drove {ev.say_distance(travelled)}. {robot.describe_position()}"

        ctx.log(
            ev.DRIVE,
            message,
            travelled_mm=round(travelled, 1),
            turned_degrees=round(turned, 1),
            **data,
        )

    async def pair_move_for_degrees(pair_id, degrees, steering=0, *, velocity=360, **_kwargs):
        left_port, right_port = _pair_ports(pair_id)
        left_v, right_v = _steering_to_velocities(steering, velocity)
        before = (robot.x, robot.y, robot.heading)
        await _move_wheels_for_degrees(left_port, right_port, left_v, right_v, degrees)
        _narrate_move(before, degrees=degrees, steering=steering)

    async def pair_move_tank_for_degrees(pair_id, degrees, left_velocity, right_velocity, **_kwargs):
        left_port, right_port = _pair_ports(pair_id)
        before = (robot.x, robot.y, robot.heading)
        await _move_wheels_for_degrees(
            left_port, right_port, left_velocity, right_velocity, degrees
        )
        _narrate_move(before, degrees=degrees)

    async def pair_move_for_time(pair_id, duration, steering=0, *, velocity=360, **_kwargs):
        pair_move(pair_id, steering, velocity=velocity)
        await ctx.sleep(duration / 1000.0)
        pair_stop(pair_id)

    motor_pair = _module(
        "motor_pair",
        pair=pair,
        unpair=lambda pair_id: pairs.pop(pair_id, None),
        move=pair_move,
        move_tank=pair_move_tank,
        move_for_degrees=pair_move_for_degrees,
        move_tank_for_degrees=pair_move_tank_for_degrees,
        move_for_time=pair_move_for_time,
        move_tank_for_time=_not_implemented("motor_pair.move_tank_for_time"),
        stop=pair_stop,
        PAIR_1=0,
        PAIR_2=1,
        PAIR_3=2,
    )

    # -- sensors ----------------------------------------------------------

    color_sensor = _module(
        "color_sensor",
        color=lambda port: robot.device(ctx.port_letter(port), ColorSensor).color,
        reflection=lambda port: robot.device(ctx.port_letter(port), ColorSensor).reflection,
        rgbi=lambda port: (
            *robot.device(ctx.port_letter(port), ColorSensor).rgb,
            robot.device(ctx.port_letter(port), ColorSensor).reflection,
        ),
    )

    distance_sensor = _module(
        "distance_sensor",
        distance=lambda port: robot.device(ctx.port_letter(port), DistanceSensor).distance_mm,
        get_pixel=_not_implemented("distance_sensor.get_pixel"),
        set_pixel=_not_implemented("distance_sensor.set_pixel"),
        clear=_not_implemented("distance_sensor.clear"),
    )

    force_sensor = _module(
        "force_sensor",
        force=lambda port: robot.device(ctx.port_letter(port), ForceSensor).force,
        pressed=lambda port: robot.device(ctx.port_letter(port), ForceSensor).pressed,
    )

    # -- hub --------------------------------------------------------------

    async def matrix_write(text):
        rendered = str(text)
        ctx.log(ev.DISPLAY, f"The hub display showed {rendered!r}.", text=rendered)
        await ctx.sleep(CHAR_DURATION_S * len(rendered))

    def matrix_set_pixel(x, y, intensity=100):
        if not (0 <= x < 5 and 0 <= y < 5):
            raise RuntimeError(f"Pixel ({x}, {y}) is off the 5 by 5 display.")
        robot.display[y * 5 + x] = max(0, min(100, intensity))

    def matrix_clear():
        robot.display[:] = [0] * 25
        ctx.log(ev.DISPLAY, "The hub display was cleared.")

    def matrix_show(image):
        values = list(image) if not isinstance(image, int) else [100] * 25
        robot.display[:] = (values + [0] * 25)[:25]
        ctx.log(ev.DISPLAY, "The hub display showed an image.")

    light_matrix = _namespace(
        write=matrix_write,
        set_pixel=matrix_set_pixel,
        clear=matrix_clear,
        show_image=matrix_show,
        show=matrix_show,
    )

    async def sound_beep(frequency=440, duration=500, volume=100):
        ctx.log(
            ev.SOUND,
            f"The hub beeped at {frequency} hertz for {duration / 1000:.1f} seconds.",
            frequency=frequency,
            duration=duration,
        )
        await ctx.sleep(duration / 1000.0)

    def sound_stop():
        ctx.log(ev.SOUND, "The hub stopped its sound.")

    sound = _namespace(beep=sound_beep, stop=sound_stop, volume=lambda *_: 100)

    def light_color(color_id):
        robot.hub_light = color_id
        ctx.log(
            ev.DISPLAY,
            f"The hub light turned {COLOR_NAMES.get(color_id, 'a colour')}.",
            color=color_id,
        )

    light = _namespace(color=light_color, on=lambda *_: None, off=lambda *_: None)

    def tilt_angles():
        """Yaw, pitch and roll in decidegrees, as the real hub reports them."""
        return (int(robot.yaw * 10), int(robot.pitch * 10), int(robot.roll * 10))

    def reset_yaw(angle=0):
        robot.yaw_zero = (robot.heading - angle) % 360
        robot.yaw = angle % 360

    motion_sensor = _namespace(
        tilt_angles=tilt_angles,
        reset_yaw=reset_yaw,
        acceleration=lambda *_: (0, 0, 1000),
        angular_velocity=lambda *_: (0, 0, 0),
        up_face=lambda: 0,
        stable=lambda: True,
    )

    button = _namespace(pressed=lambda *_: 0)

    port_module = _namespace(**{letter: index for index, letter in enumerate(PORTS)})

    hub = _module(
        "hub",
        light_matrix=light_matrix,
        sound=sound,
        light=light,
        motion_sensor=motion_sensor,
        button=button,
        port=port_module,
        battery=_namespace(percentage=lambda: robot.config.battery_percent),
        temperature=lambda: 25,
        LEFT_BUTTON=0,
        RIGHT_BUTTON=1,
    )

    # -- color constants --------------------------------------------------

    from ..world import (
        AZURE, BLACK, BLUE, GREEN, MAGENTA, ORANGE, PURPLE, RED,
        TURQUOISE, UNKNOWN, WHITE, YELLOW,
    )

    color = _module(
        "color",
        BLACK=BLACK, MAGENTA=MAGENTA, PURPLE=PURPLE, BLUE=BLUE, AZURE=AZURE,
        TURQUOISE=TURQUOISE, GREEN=GREEN, YELLOW=YELLOW, ORANGE=ORANGE,
        RED=RED, WHITE=WHITE, UNKNOWN=UNKNOWN,
    )

    # -- app --------------------------------------------------------------

    async def app_sound_play(name, volume=100, **_kwargs):
        ctx.log(ev.SOUND, f"The app played the sound {name!r}.", sound=name)
        await ctx.sleep(0.3)

    app = _module(
        "app",
        sound=_namespace(play=app_sound_play, stop=lambda *_: None),
        display=_namespace(
            write=_not_implemented("app.display.write"),
            clear=_not_implemented("app.display.clear"),
        ),
        bargraph=_namespace(change=_not_implemented("app.bargraph.change")),
    )

    # -- time -------------------------------------------------------------
    # MicroPython's time module, which real SPIKE programs use for timing
    # loops. Ticks come from the simulated clock, not the wall clock.

    def ticks_ms() -> int:
        return int(robot.time * 1000)

    time_module = _module(
        "time",
        ticks_ms=ticks_ms,
        ticks_us=lambda: int(robot.time * 1_000_000),
        ticks_diff=lambda a, b: a - b,
        ticks_add=lambda ticks, delta: ticks + delta,
        sleep_ms=_not_implemented("time.sleep_ms (use await runloop.sleep_ms)"),
        sleep=_not_implemented("time.sleep (use await runloop.sleep_ms)"),
    )

    return {
        "time": time_module,
        "runloop": runloop,
        "motor": motor,
        "motor_pair": motor_pair,
        "color_sensor": color_sensor,
        "distance_sensor": distance_sensor,
        "force_sensor": force_sensor,
        "hub": hub,
        "color": color,
        "app": app,
    }
`,"server.py":`"""
Network front end for the simulator.

One port serves two kinds of client, told apart by their first bytes:

* **WebSocket** (the request starts \`\`GET\`\`) -- for the browser editor.
  Binary messages carry COBS protocol frames, byte for byte what would go
  over Web Bluetooth. Text messages are JSON, and carry the narrated event
  log and robot telemetry that no real hub could give you.

* **Raw TCP** (anything else) -- a bare stream of COBS frames, so LEGO's own
  reference client works against the simulator once its BLE calls are
  swapped for a socket.

The WebSocket implementation is deliberately small and dependency-free: the
frames involved are a few hundred bytes and never fragmented, and a robotics
club should be able to run this with nothing but a Python install.
"""

from __future__ import annotations

import asyncio
import base64
import hashlib
import json
import struct

from . import events as ev
from .hub import HubSimulator
from .telemetry import event_payload, hello_payload, snapshot_payload

WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

OP_CONTINUATION = 0x0
OP_TEXT = 0x1
OP_BINARY = 0x2
OP_CLOSE = 0x8
OP_PING = 0x9
OP_PONG = 0xA


class Connection:
    """One connected client, WebSocket or raw."""

    def __init__(self, writer: asyncio.StreamWriter, websocket: bool):
        self.writer = writer
        self.websocket = websocket
        self.queue: asyncio.Queue = asyncio.Queue()

        self.observer = False
        """A viewer that only watches.

        A 3D view is a second client on the same socket, but it is not an app:
        it never sends a program and has no use for protocol frames. Marking it
        keeps it out of the narration, so a student is not told "an app
        connected to the hub" because someone opened a window.
        """

    def send_frame(self, frame: bytes) -> None:
        """Queue a protocol frame for delivery. Safe to call synchronously."""
        if self.observer:
            return
        self.queue.put_nowait((OP_BINARY, frame))

    def send_json(self, payload: dict) -> None:
        if self.websocket:
            self.queue.put_nowait((OP_TEXT, json.dumps(payload).encode("utf8")))

    async def pump(self) -> None:
        while True:
            opcode, data = await self.queue.get()
            if self.websocket:
                self.writer.write(_ws_frame(opcode, data))
            elif opcode == OP_BINARY:
                self.writer.write(data)
            await self.writer.drain()


class SimulatorServer:
    """Serves one shared hub to every client that connects."""

    def __init__(self, hub: HubSimulator, host: str = "127.0.0.1", port: int = 8765,
                 snapshot_interval: float = 0.05):
        self.hub = hub
        self.host = host
        self.port = port
        self.snapshot_interval = snapshot_interval
        self.connections: list[Connection] = []
        self._server: asyncio.Server | None = None

        hub.set_send(self._broadcast_frame)
        hub.log.subscribe(self._broadcast_event)

    # -- fan-out ------------------------------------------------------------

    def _broadcast_frame(self, frame: bytes) -> None:
        for connection in list(self.connections):
            connection.send_frame(frame)

    def _broadcast_event(self, event: ev.Event) -> None:
        payload = event_payload(event)
        for connection in list(self.connections):
            connection.send_json(payload)

    async def _snapshot_loop(self) -> None:
        while True:
            await asyncio.sleep(self.snapshot_interval)
            if not self.connections:
                continue
            payload = snapshot_payload(self.hub.robot)
            for connection in list(self.connections):
                connection.send_json(payload)

    # -- lifecycle ----------------------------------------------------------

    async def start(self) -> None:
        await self.hub.start()
        self._server = await asyncio.start_server(self._handle, self.host, self.port)
        asyncio.create_task(self._snapshot_loop())

    async def serve_forever(self) -> None:
        await self.start()
        async with self._server:
            await self._server.serve_forever()

    # -- per-connection -----------------------------------------------------

    async def _handle(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
        peek = await reader.read(4)
        if not peek:
            writer.close()
            return

        is_websocket = peek == b"GET "
        connection = Connection(writer, websocket=is_websocket)

        if is_websocket:
            rest = await reader.readuntil(b"\\r\\n\\r\\n")
            request = peek + rest
            if not await _ws_handshake(request, writer):
                writer.close()
                return
            # Read the observer flag off the handshake rather than waiting for
            # a command: a command arrives after the connection is announced,
            # which is exactly the announcement it is meant to prevent.
            request_line = request.split(b"\\r\\n", 1)[0]
            connection.observer = b"observe" in request_line

        # "hello" must be the first thing a client sees, so it is queued
        # before anything that broadcasts.
        connection.send_json(hello_payload(self.hub.robot))

        # Register before feeding the hub anything. A raw client's first frame
        # arrives inside \`peek\`, and if the connection is not on the list yet
        # the hub's reply to it is broadcast to nobody and silently lost.
        self.connections.append(connection)
        pump = asyncio.create_task(connection.pump())

        if not connection.observer:
            self.hub.log.emit(
                ev.PROGRAM,
                "An app connected to the hub."
                if is_websocket
                else "A program connected to the hub.",
            )

        if not is_websocket:
            self.hub.receive_bytes(peek)
        try:
            if is_websocket:
                await self._read_websocket(reader, connection)
            else:
                await self._read_raw(reader)
        except (asyncio.IncompleteReadError, ConnectionResetError, BrokenPipeError):
            pass
        finally:
            pump.cancel()
            if connection in self.connections:
                self.connections.remove(connection)
            if not connection.observer:
                self.hub.log.emit(ev.PROGRAM, "The app disconnected.")
            writer.close()

    async def _read_raw(self, reader: asyncio.StreamReader) -> None:
        while True:
            data = await reader.read(4096)
            if not data:
                return
            self.hub.receive_bytes(data)

    async def _read_websocket(self, reader: asyncio.StreamReader, connection: Connection) -> None:
        while True:
            opcode, payload = await _ws_read(reader)
            if opcode == OP_CLOSE:
                return
            if opcode == OP_PING:
                connection.queue.put_nowait((OP_PONG, payload))
            elif opcode == OP_BINARY:
                self.hub.receive_bytes(payload)
            elif opcode == OP_TEXT:
                self._handle_command(payload, connection)

    def _handle_command(self, payload: bytes, connection: "Connection | None" = None) -> None:
        """Simulator-only commands, which a real hub would have no idea about."""
        try:
            command = json.loads(payload)
        except ValueError:
            return

        action = command.get("action")
        robot = self.hub.robot

        if action == "observe":
            if connection is not None:
                connection.observer = True
        elif action == "press":
            robot.press_force_sensor(command.get("port", "E"), command.get("force", 100))
        elif action == "reset":
            robot.x = robot.config.start_x
            robot.y = robot.config.start_y
            robot.heading = robot.config.start_heading
            robot.stop_all_motors()
            robot.reset_odometer()
            self.hub.log.emit(ev.PROGRAM, "The robot was put back at its starting place.")
        elif action == "place":
            robot.x = float(command.get("x", robot.x))
            robot.y = float(command.get("y", robot.y))
            robot.heading = float(command.get("heading", robot.heading))
            self.hub.log.emit(ev.PROGRAM, f"The robot was moved. {robot.describe_position()}")
        elif action == "speed":
            self.hub.speed = max(0.1, float(command.get("value", 1.0)))
        elif action == "describe":
            self.hub.log.emit(ev.PROGRAM, robot.describe_position())


# --------------------------------------------------------------------------
# minimal RFC 6455
# --------------------------------------------------------------------------

async def _ws_handshake(request: bytes, writer: asyncio.StreamWriter) -> bool:
    key = None
    for line in request.split(b"\\r\\n"):
        if line.lower().startswith(b"sec-websocket-key:"):
            key = line.split(b":", 1)[1].strip().decode()
            break
    if not key:
        writer.write(b"HTTP/1.1 400 Bad Request\\r\\n\\r\\n")
        await writer.drain()
        return False

    accept = base64.b64encode(
        hashlib.sha1((key + WS_GUID).encode()).digest()
    ).decode()
    writer.write(
        b"HTTP/1.1 101 Switching Protocols\\r\\n"
        b"Upgrade: websocket\\r\\n"
        b"Connection: Upgrade\\r\\n"
        b"Sec-WebSocket-Accept: " + accept.encode() + b"\\r\\n\\r\\n"
    )
    await writer.drain()
    return True


async def _ws_read(reader: asyncio.StreamReader) -> tuple[int, bytes]:
    """Read one message, reassembling continuation frames."""
    opcode = None
    buffer = bytearray()

    while True:
        header = await reader.readexactly(2)
        final = bool(header[0] & 0x80)
        frame_opcode = header[0] & 0x0F
        masked = bool(header[1] & 0x80)
        length = header[1] & 0x7F

        if length == 126:
            length = struct.unpack(">H", await reader.readexactly(2))[0]
        elif length == 127:
            length = struct.unpack(">Q", await reader.readexactly(8))[0]

        mask = await reader.readexactly(4) if masked else None
        payload = await reader.readexactly(length) if length else b""
        if mask:
            payload = bytes(byte ^ mask[i % 4] for i, byte in enumerate(payload))

        if frame_opcode in (OP_CLOSE, OP_PING, OP_PONG):
            return frame_opcode, payload  # control frames are never fragmented

        if opcode is None:
            opcode = frame_opcode
        buffer.extend(payload)

        if final:
            return opcode, bytes(buffer)


def _ws_frame(opcode: int, payload: bytes) -> bytes:
    header = bytearray([0x80 | opcode])
    length = len(payload)
    if length < 126:
        header.append(length)
    elif length < 65536:
        header.append(126)
        header.extend(struct.pack(">H", length))
    else:
        header.append(127)
        header.extend(struct.pack(">Q", length))
    return bytes(header) + payload
`,"telemetry.py":`"""
The JSON a viewer sees.

These payloads are the simulator's second output channel: not the hub
protocol, which is bytes and belongs to LEGO, but the plain-language
narration and the robot's state, which no real hub can report.

They live here rather than in the server because there is now more than one
way to reach the simulator -- a WebSocket from another process, and a worker
running it inside the browser -- and a viewer must not be able to tell which
it is talking to. One definition, both callers.
"""

from __future__ import annotations

from . import events as ev


def hello_payload(robot) -> dict:
    """Sent once, when something connects: the mat, and where the robot is."""
    return {
        "type": "hello",
        "world": robot.world.to_dict(),
        "robot": robot.snapshot(),
    }


def snapshot_payload(robot) -> dict:
    """The robot's state, often enough to animate from."""
    return {"type": "snapshot", "robot": robot.snapshot()}


def event_payload(event: ev.Event) -> dict:
    """One narrated event, as a viewer receives it."""
    return {
        "type": "event",
        "kind": event.kind,
        "message": event.message,
        "time": round(event.sim_time, 3),
        "data": event.data,
    }
`,"vendor/__init__.py":"","vendor/cobs.py":`"""
Example implementation of the Consistent Overhead Byte Stuffing (COBS) algorithm
used by the SPIKE\u2122 Prime BLE protocol.

This implementation prioritizes readability and simplicity over performance and
should be used for educational purposes only.
"""

DELIMITER = 0x02
"""Delimiter used to mark end of frame"""

NO_DELIMITER = 0xFF
"""Code word indicating no delimiter in block"""

COBS_CODE_OFFSET = DELIMITER
"""Offset added to code word"""

MAX_BLOCK_SIZE = 84
"""Maximum block size (incl. code word)"""

XOR = 3
"""XOR mask for encoding"""


def encode(data: bytes):
    """
    Encode data using COBS algorithm, such that no delimiters are present.
    """
    buffer = bytearray()
    code_index = block = 0
    def begin_block():
        """Append code word to buffer and update code_index and block"""
        nonlocal code_index, block
        code_index = len(buffer)  # index of incomplete code word
        buffer.append(NO_DELIMITER)  # updated later if delimiter is encountered
        block = 1  # no. of bytes in block (incl. code word)

    begin_block()
    for byte in data:
        if byte > DELIMITER:
            # non-delimeter value, write as-is
            buffer.append(byte)
            block += 1

        if byte <= DELIMITER or block > MAX_BLOCK_SIZE:
            # block completed because size limit reached or delimiter found
            if byte <= DELIMITER:
                # reason for block completion is delimiter
                # update code word to reflect block size
                delimiter_base = byte * MAX_BLOCK_SIZE
                block_offset = block + COBS_CODE_OFFSET
                buffer[code_index] = delimiter_base + block_offset
            # begin new block
            begin_block()

    # update final code word
    buffer[code_index] = block + COBS_CODE_OFFSET

    return buffer


def decode(data: bytes):
    """
    Decode data using COBS algorithm.
    """
    buffer = bytearray()

    def unescape(code: int):
        """Decode code word, returning value and block size"""
        if code == 0xFF:
            # no delimiter in block
            return None, MAX_BLOCK_SIZE + 1
        value, block = divmod(code - COBS_CODE_OFFSET, MAX_BLOCK_SIZE)
        if block == 0:
            # maximum block size ending with delimiter
            block = MAX_BLOCK_SIZE
            value -= 1
        return value, block

    value, block = unescape(data[0])
    for byte in data[1:]:  # first byte already processed
        block -= 1
        if block > 0:
            buffer.append(byte)
            continue

        # block completed
        if value is not None:
            buffer.append(value)

        value, block = unescape(byte)

    return buffer


def pack(data: bytes):
    """
    Encode and frame data for transmission.
    """
    buffer = encode(data)

    # XOR buffer to remove problematic ctrl+C
    for i in range(len(buffer)):
        buffer[i] ^= XOR

    # add delimiter
    buffer.append(DELIMITER)
    return bytes(buffer)


def unpack(frame: bytes):
    """
    Unframe and decode frame.
    """
    start = 0
    if frame[0] == 0x01:  # unused priority byte
        start += 1
    # unframe and XOR
    unframed = bytes(map(lambda x: x ^ XOR, frame[start:-1]))
    return bytes(decode(unframed))
`,"vendor/crc.py":`from binascii import crc32 as _crc32


def crc(data: bytes, seed=0, align=4):
    """
    Calculate the CRC32 of data with an optional seed and alignment.
    """
    remainder = len(data) % align
    if remainder:
        data += b"\\x00" * (align - remainder)
    return _crc32(data, seed)
`,"vendor/messages.py":`from __future__ import annotations
from abc import ABC
import struct


class BaseMessage(ABC):
    @property
    def ID(cls) -> int:
        raise NotImplementedError

    def serialize(self) -> bytes:
        raise NotImplementedError

    @staticmethod
    def deserialize(data: bytes) -> BaseMessage:
        raise NotImplementedError

    def __str__(self) -> str:
        props = vars(self)
        plist = ", ".join(f"{k}={v}" for k, v in props.items())
        return f"{self.__class__.__name__}({plist})"


def StatusResponse(name: str, id: int):
    class BaseStatusResponse(BaseMessage):
        ID = id

        def __init__(self, success: bool):
            self.success = success

        @staticmethod
        def deserialize(data: bytes):
            id, status = struct.unpack("<BB", data)
            return BaseStatusResponse(status == 0x00)

    BaseStatusResponse.__name__ = name
    return BaseStatusResponse


class InfoRequest(BaseMessage):
    ID = 0x00

    def serialize(self):
        return b"\\0"


class InfoResponse(BaseMessage):
    ID = 0x01

    def __init__(
        self,
        rpc_major: int,
        rpc_minor: int,
        rpc_build: int,
        firmware_major: int,
        firmware_minor: int,
        firmware_build: int,
        max_packet_size: int,
        max_message_size: int,
        max_chunk_size: int,
        product_group_device: int,
    ):
        self.rpc_major = rpc_major
        self.rpc_minor = rpc_minor
        self.rpc_build = rpc_build
        self.firmware_major = firmware_major
        self.firmware_minor = firmware_minor
        self.firmware_build = firmware_build
        self.max_packet_size = max_packet_size
        self.max_message_size = max_message_size
        self.max_chunk_size = max_chunk_size
        self.product_group_device = product_group_device

    @staticmethod
    def deserialize(data: bytes) -> InfoResponse:
        (
            id,
            rpc_major,
            rpc_minor,
            rpc_build,
            firmware_major,
            firmware_minor,
            firmware_build,
            max_packet_size,
            max_message_size,
            max_chunk_size,
            product_group_device,
        ) = struct.unpack("<BBBHBBHHHHH", data)
        return InfoResponse(
            rpc_major,
            rpc_minor,
            rpc_build,
            firmware_major,
            firmware_minor,
            firmware_build,
            max_packet_size,
            max_message_size,
            max_chunk_size,
            product_group_device,
        )


class ClearSlotRequest(BaseMessage):
    ID = 0x46

    def __init__(self, slot: int):
        self.slot = slot

    def serialize(self):
        return struct.pack("<BB", self.ID, self.slot)


ClearSlotResponse = StatusResponse("ClearSlotResponse", 0x47)


class StartFileUploadRequest(BaseMessage):
    ID = 0x0C

    def __init__(self, file_name: str, slot: int, crc: int):
        self.file_name = file_name
        self.slot = slot
        self.crc = crc

    def serialize(self):
        encoded_name = self.file_name.encode("utf8")
        if len(encoded_name) > 31:
            raise ValueError(
                f"UTF-8 encoded file name too long: {len(encoded_name)} +1 >= 32"
            )
        fmt = f"<B{len(encoded_name)+1}sBI"
        return struct.pack(fmt, self.ID, encoded_name, self.slot, self.crc)


StartFileUploadResponse = StatusResponse("StartFileUploadResponse", 0x0D)


class TransferChunkRequest(BaseMessage):
    ID = 0x10

    def __init__(self, running_crc: int, chunk: bytes):
        self.running_crc = running_crc
        self.size = len(chunk)
        self.payload = chunk

    def serialize(self):
        fmt = f"<BIH{self.size}s"
        return struct.pack(fmt, self.ID, self.running_crc, self.size, self.payload)


TransferChunkResponse = StatusResponse("TransferChunkResponse", 0x11)


class ProgramFlowRequest(BaseMessage):
    ID = 0x1E

    def __init__(self, stop: bool, slot: int):
        self.stop = stop
        self.slot = slot

    def serialize(self):
        return struct.pack("<BBB", self.ID, self.stop, self.slot)


ProgramFlowResponse = StatusResponse("ProgramFlowResponse", 0x1F)


class ProgramFlowNotification(BaseMessage):
    ID = 0x20

    def __init__(self, stop: bool):
        self.stop = stop

    @staticmethod
    def deserialize(data: bytes) -> ProgramFlowNotification:
        id, stop = struct.unpack("<BB", data)
        return ProgramFlowNotification(bool(stop))


class ConsoleNotification(BaseMessage):
    ID = 0x21

    def __init__(self, text: str):
        self.text = text

    @staticmethod
    def deserialize(data: bytes) -> ConsoleNotification:
        text_bytes = data[1:].rstrip(b"\\0")
        return ConsoleNotification(text_bytes.decode("utf8"))

    def __str__(self) -> str:
        return f"{self.__class__.__name__}({self.text!r})"


class DeviceNotificationRequest(BaseMessage):
    ID = 0x28

    def __init__(self, interval_ms: int):
        self.interval_ms = interval_ms

    def serialize(self):
        return struct.pack("<BH", self.ID, self.interval_ms)


DeviceNotificationResponse = StatusResponse("DeviceNotificationResponse", 0x29)

DEVICE_MESSAGE_MAP = {
    0x00: ("Battery", "<BB"),
    0x01: ("IMU", "<BBBhhhhhhhhh"),
    0x02: ("5x5", "<B25B"),
    0x0A: ("Motor", "<BBBhhbi"),
    0x0B: ("Force", "<BBBB"),
    0x0C: ("Color", "<BBbHHH"),
    0x0D: ("Distance", "<BBh"),
    0x0E: ("3x3", "<BB9B"),
}


class DeviceNotification(BaseMessage):
    ID = 0x3C

    def __init__(self, size: int, payload: bytes):
        self.size = size
        self._payload = payload
        self.messages = []
        data = payload[:]
        while data:
            id = data[0]
            if id in DEVICE_MESSAGE_MAP:
                name, fmt = DEVICE_MESSAGE_MAP[id]
                size = struct.calcsize(fmt)
                values = struct.unpack(fmt, data[:size])
                self.messages.append((name, values))
                data = data[size:]
            else:
                print(f"Unknown message: {id}")
                break

    @staticmethod
    def deserialize(data: bytes) -> DeviceNotification:
        id, size = struct.unpack("<BH", data[:3])
        if len(data) != size + 3:
            print(f"Unexpected size: {len(data)} != {size} + 3")
        return DeviceNotification(size, data[3:])

    def __str__(self) -> str:
        updated = list(map(lambda x: x[0], self.messages))
        return f"{self.__class__.__name__}({updated})"


KNOWN_MESSAGES = {
    M.ID: M
    for M in (
        InfoRequest,
        InfoResponse,
        ClearSlotRequest,
        ClearSlotResponse,
        StartFileUploadRequest,
        StartFileUploadResponse,
        TransferChunkRequest,
        TransferChunkResponse,
        ProgramFlowRequest,
        ProgramFlowResponse,
        ProgramFlowNotification,
        ConsoleNotification,
        DeviceNotificationRequest,
        DeviceNotificationResponse,
        DeviceNotification,
    )
}


def deserialize(data: bytes):
    message_type = data[0]
    if message_type in KNOWN_MESSAGES:
        return KNOWN_MESSAGES[message_type].deserialize(data)
    raise ValueError(f"Unknown message: {data.hex(' ')}")
`,"wire.py":`"""
Hub-side view of the SPIKE(TM) Prime protocol.

LEGO's reference \`\`messages.py\`\` (vendored unmodified under \`\`vendor/\`\`) is
written from the *client's* point of view: requests know how to serialize,
responses know how to deserialize. The simulator is the *hub*, so it needs
exactly the other half -- parse requests, build responses and notifications.

That half lives here. Framing (COBS + CRC32) is not reimplemented: we import
LEGO's own \`\`cobs\`\` and \`\`crc\`\` so the bytes on the wire cannot drift.

Struct layouts are taken from the same source of truth LEGO's client uses --
see \`\`vendor/messages.py\`\` and https://lego.github.io/spike-prime-docs/
"""

from __future__ import annotations

import struct
from dataclasses import dataclass
from typing import Iterable

from .vendor import cobs
from .vendor.crc import crc

__all__ = [
    "crc",
    "pack_frame",
    "unpack_frame",
    "parse_request",
    "InfoRequest",
    "ClearSlotRequest",
    "StartFileUploadRequest",
    "TransferChunkRequest",
    "ProgramFlowRequest",
    "DeviceNotificationRequest",
    "UnknownRequest",
    "info_response",
    "status_response",
    "console_notification",
    "program_flow_notification",
    "device_notification",
    "battery_entry",
    "imu_entry",
    "matrix_5x5_entry",
    "motor_entry",
    "force_entry",
    "color_entry",
    "distance_entry",
    "matrix_3x3_entry",
]


# --------------------------------------------------------------------------
# framing
# --------------------------------------------------------------------------

def pack_frame(payload: bytes) -> bytes:
    """COBS-encode and frame a serialized message for transmission."""
    return cobs.pack(payload)


def unpack_frame(frame: bytes) -> bytes:
    """Unframe and COBS-decode a received frame, returning the message payload."""
    return cobs.unpack(frame)


# --------------------------------------------------------------------------
# requests (client -> hub)
# --------------------------------------------------------------------------

@dataclass(frozen=True)
class InfoRequest:
    ID = 0x00


@dataclass(frozen=True)
class ClearSlotRequest:
    ID = 0x46
    slot: int


@dataclass(frozen=True)
class StartFileUploadRequest:
    ID = 0x0C
    file_name: str
    slot: int
    crc: int


@dataclass(frozen=True)
class TransferChunkRequest:
    ID = 0x10
    running_crc: int
    payload: bytes


@dataclass(frozen=True)
class ProgramFlowRequest:
    ID = 0x1E
    stop: bool
    slot: int


@dataclass(frozen=True)
class DeviceNotificationRequest:
    ID = 0x28
    interval_ms: int


@dataclass(frozen=True)
class UnknownRequest:
    """A message id the simulator does not implement.

    Surfaced rather than swallowed: an unimplemented message is a gap in the
    simulator, and gaps should be loud.
    """

    id: int
    data: bytes


def parse_request(data: bytes):
    """Deserialize a client->hub message payload."""
    if not data:
        raise ValueError("empty message")

    message_id = data[0]

    if message_id == InfoRequest.ID:
        return InfoRequest()

    if message_id == ClearSlotRequest.ID:
        _, slot = struct.unpack("<BB", data)
        return ClearSlotRequest(slot=slot)

    if message_id == StartFileUploadRequest.ID:
        # <B {name+NUL} B I> -- the name is NUL-terminated and variable length,
        # so the fixed tail (slot + crc = 5 bytes) is peeled off the end.
        name_bytes = data[1:-5]
        slot, file_crc = struct.unpack("<BI", data[-5:])
        return StartFileUploadRequest(
            file_name=name_bytes.rstrip(b"\\0").decode("utf8"),
            slot=slot,
            crc=file_crc,
        )

    if message_id == TransferChunkRequest.ID:
        _, running_crc, size = struct.unpack("<BIH", data[:7])
        payload = data[7 : 7 + size]
        if len(payload) != size:
            raise ValueError(
                f"TransferChunkRequest declared {size} bytes but carried {len(payload)}"
            )
        return TransferChunkRequest(running_crc=running_crc, payload=payload)

    if message_id == ProgramFlowRequest.ID:
        _, stop, slot = struct.unpack("<BBB", data)
        return ProgramFlowRequest(stop=bool(stop), slot=slot)

    if message_id == DeviceNotificationRequest.ID:
        _, interval_ms = struct.unpack("<BH", data)
        return DeviceNotificationRequest(interval_ms=interval_ms)

    return UnknownRequest(id=message_id, data=data)


# --------------------------------------------------------------------------
# responses and notifications (hub -> client)
# --------------------------------------------------------------------------

def info_response(
    *,
    rpc_major: int = 3,
    rpc_minor: int = 0,
    rpc_build: int = 0,
    firmware_major: int = 3,
    firmware_minor: int = 4,
    firmware_build: int = 0,
    max_packet_size: int = 244,
    max_message_size: int = 1024,
    max_chunk_size: int = 512,
    product_group_device: int = 0x0000,
) -> bytes:
    """Build an InfoResponse (0x01).

    \`\`max_chunk_size\`\` must stay a multiple of 4. LEGO's \`\`crc()\`\` zero-pads to
    a 4-byte boundary, so a client chaining a running CRC chunk-by-chunk only
    arrives at the whole-file CRC when every chunk except the last is aligned.
    """
    if max_chunk_size % 4:
        raise ValueError("max_chunk_size must be a multiple of 4 (see crc alignment)")
    return struct.pack(
        "<BBBHBBHHHHH",
        0x01,
        rpc_major,
        rpc_minor,
        rpc_build,
        firmware_major,
        firmware_minor,
        firmware_build,
        max_packet_size,
        max_message_size,
        max_chunk_size,
        product_group_device,
    )


def status_response(message_id: int, success: bool) -> bytes:
    """Build a generic status response. 0x00 means success."""
    return struct.pack("<BB", message_id, 0x00 if success else 0x01)


def console_notification(text: str) -> bytes:
    """Build a ConsoleNotification (0x21) carrying program output."""
    encoded = text.encode("utf8")[:255]
    return struct.pack("<B", 0x21) + encoded


def program_flow_notification(stop: bool) -> bytes:
    """Build a ProgramFlowNotification (0x20)."""
    return struct.pack("<BB", 0x20, 1 if stop else 0)


def device_notification(entries: Iterable[bytes]) -> bytes:
    """Build a DeviceNotification (0x3C) wrapping concatenated device entries."""
    payload = b"".join(entries)
    return struct.pack("<BH", 0x3C, len(payload)) + payload


# -- individual device entries, matching vendor.messages.DEVICE_MESSAGE_MAP ---

def battery_entry(percent: int) -> bytes:
    return struct.pack("<BB", 0x00, _clamp(percent, 0, 100))


def imu_entry(
    face_up: int,
    yaw_face: int,
    yaw: int,
    pitch: int,
    roll: int,
    accel: tuple[int, int, int],
    gyro: tuple[int, int, int],
) -> bytes:
    return struct.pack(
        "<BBBhhhhhhhhh",
        0x01,
        face_up,
        yaw_face,
        _i16(yaw),
        _i16(pitch),
        _i16(roll),
        *(_i16(v) for v in accel),
        *(_i16(v) for v in gyro),
    )


def matrix_5x5_entry(pixels: list[int]) -> bytes:
    if len(pixels) != 25:
        raise ValueError(f"5x5 display needs 25 pixels, got {len(pixels)}")
    return struct.pack("<B25B", 0x02, *(_clamp(p, 0, 100) for p in pixels))


def motor_entry(
    port: int,
    device_type: int,
    absolute_position: int,
    power: int,
    speed: int,
    position: int,
) -> bytes:
    return struct.pack(
        "<BBBhhbi",
        0x0A,
        port,
        device_type,
        _i16(absolute_position),
        _i16(power),
        _clamp(speed, -128, 127),
        _i32(position),
    )


def force_entry(port: int, value: int, pressed: bool) -> bytes:
    return struct.pack("<BBBB", 0x0B, port, _clamp(value, 0, 255), 1 if pressed else 0)


def color_entry(port: int, color: int, rgb: tuple[int, int, int]) -> bytes:
    # colour is signed: -1 means "no colour detected"
    return struct.pack(
        "<BBbHHH", 0x0C, port, _clamp(color, -1, 127), *(_u16(v) for v in rgb)
    )


def distance_entry(port: int, distance_mm: int) -> bytes:
    # -1 means "nothing in range"
    return struct.pack("<BBh", 0x0D, port, _i16(distance_mm))


def matrix_3x3_entry(port: int, pixels: list[int]) -> bytes:
    if len(pixels) != 9:
        raise ValueError(f"3x3 matrix needs 9 pixels, got {len(pixels)}")
    return struct.pack("<BB9B", 0x0E, port, *(_clamp(p, 0, 255) for p in pixels))


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------

def _clamp(value: int, low: int, high: int) -> int:
    return max(low, min(high, int(value)))


def _i16(value) -> int:
    return _clamp(round(value), -32768, 32767)


def _u16(value) -> int:
    return _clamp(round(value), 0, 65535)


def _i32(value) -> int:
    return _clamp(round(value), -(2**31), 2**31 - 1)
`,"world.py":`"""
The surface the simulated robot drives on, and the things it can bump into.

Coordinates are millimetres in a right-handed frame: +x to the right, +y away
from the near edge of the mat, heading measured in degrees counter-clockwise
from +x. This matches the convention used in \`\`robot.py\`\`.

The default world is a plain practice mat with a black line, which is enough
to exercise the blocks a first-year club actually teaches: drive, turn, follow
a line, stop at an obstacle. Swap it for a real challenge mat by loading a
JSON description -- see \`\`World.from_dict\`\`.
"""

from __future__ import annotations

import json
import math
from dataclasses import dataclass, field
from pathlib import Path

# LEGO colour ids, as used by the SPIKE \`color\` module and reported by the
# colour sensor over the wire.
BLACK = 0
MAGENTA = 1
PURPLE = 2
BLUE = 3
AZURE = 4
TURQUOISE = 5
GREEN = 6
YELLOW = 7
ORANGE = 8
RED = 9
WHITE = 10
UNKNOWN = -1

SENSOR_APERTURE_MM = 10.0
"""Roughly the floor patch a SPIKE colour sensor averages over."""

COLOR_NAMES = {
    BLACK: "black",
    MAGENTA: "magenta",
    PURPLE: "purple",
    BLUE: "blue",
    AZURE: "azure",
    TURQUOISE: "turquoise",
    GREEN: "green",
    YELLOW: "yellow",
    ORANGE: "orange",
    RED: "red",
    WHITE: "white",
    UNKNOWN: "no colour",
}

# Approximate sRGB and reflected-light values for each mat colour. Reflection
# is what a line-following program actually reads, so these matter more than
# the RGB triples.
COLOR_PROPERTIES = {
    BLACK: ((10, 10, 10), 6),
    WHITE: ((255, 255, 255), 94),
    RED: ((200, 30, 30), 28),
    GREEN: ((30, 160, 70), 34),
    BLUE: ((30, 70, 190), 22),
    YELLOW: ((240, 215, 60), 72),
    MAGENTA: ((200, 50, 140), 36),
    PURPLE: ((110, 60, 170), 24),
    AZURE: ((60, 150, 220), 48),
    TURQUOISE: ((50, 190, 180), 56),
    ORANGE: ((235, 130, 40), 52),
}


@dataclass
class LinePath:
    """A black line laid down as a polyline of a given width."""

    points: list[tuple[float, float]]
    width_mm: float = 20.0
    color: int = BLACK

    def distance_to(self, x: float, y: float) -> float:
        """Shortest distance from a point to the centreline."""
        best = math.inf
        for (x1, y1), (x2, y2) in zip(self.points, self.points[1:]):
            best = min(best, _point_segment_distance(x, y, x1, y1, x2, y2))
        return best

    def covers(self, x: float, y: float) -> bool:
        return self.distance_to(x, y) <= self.width_mm / 2


@dataclass
class ColorPatch:
    """A rectangular region of a single colour, e.g. a mission target area."""

    x: float
    y: float
    width: float
    height: float
    color: int

    def covers(self, px: float, py: float) -> bool:
        return self.x <= px <= self.x + self.width and self.y <= py <= self.y + self.height


@dataclass
class Obstacle:
    """A wall or block the distance sensor can see. Axis-aligned."""

    x: float
    y: float
    width: float
    height: float
    name: str = "obstacle"

    def segments(self) -> list[tuple[float, float, float, float]]:
        x0, y0 = self.x, self.y
        x1, y1 = self.x + self.width, self.y + self.height
        return [
            (x0, y0, x1, y0),
            (x1, y0, x1, y1),
            (x1, y1, x0, y1),
            (x0, y1, x0, y0),
        ]


@dataclass
class World:
    """A mat, the markings on it, and anything standing on top of it."""

    width_mm: float = 2362.0   # a FIRST LEGO League mat is roughly 2362 x 1143
    height_mm: float = 1143.0
    background: int = WHITE
    lines: list[LinePath] = field(default_factory=list)
    patches: list[ColorPatch] = field(default_factory=list)
    obstacles: list[Obstacle] = field(default_factory=list)
    walls: bool = True
    """Treat the mat edge as a wall the distance sensor can see."""

    # -- surface sampling ---------------------------------------------------

    def color_at(self, x: float, y: float) -> int:
        """Colour id under a point. Patches sit on top of lines."""
        if not self.contains(x, y):
            return UNKNOWN
        for patch in self.patches:
            if patch.covers(x, y):
                return patch.color
        for line in self.lines:
            if line.covers(x, y):
                return line.color
        return self.background

    def sample(self, x: float, y: float) -> tuple[int, int, tuple[int, int, int]]:
        """What a colour sensor actually reports here: colour, reflection, RGB.

        A real sensor reads a patch of floor about 10mm across, not a point.
        Crossing a line edge therefore gives a *ramp* of reflected light, and
        that ramp is exactly what a proportional line-follower steers on -- a
        hard black/white step would let programs pass here that stall on real
        hardware.

        Colour and reflection are derived together so they can never disagree.
        Deriving them separately produced readings like "white, reflecting 10
        percent", which is physically impossible and, worse, unnarratable.
        """
        if not self.contains(x, y):
            return UNKNOWN, 0, (0, 0, 0)

        # a patch is painted over everything and has no soft edge worth modelling
        for patch in self.patches:
            if patch.covers(x, y):
                rgb, reflection = COLOR_PROPERTIES.get(patch.color, ((0, 0, 0), 50))
                return patch.color, reflection, rgb

        background_rgb, background_reflection = COLOR_PROPERTIES.get(
            self.background, ((0, 0, 0), 50)
        )

        nearest, nearest_distance = None, math.inf
        for line in self.lines:
            distance = line.distance_to(x, y)
            if distance < nearest_distance:
                nearest, nearest_distance = line, distance

        if nearest is None:
            return self.background, background_reflection, background_rgb

        line_rgb, line_reflection = COLOR_PROPERTIES.get(nearest.color, ((0, 0, 0), 50))
        half = nearest.width_mm / 2

        if nearest_distance <= half:
            return nearest.color, line_reflection, line_rgb

        if nearest_distance <= half + SENSOR_APERTURE_MM:
            t = (nearest_distance - half) / SENSOR_APERTURE_MM
            reflection = round(line_reflection + (background_reflection - line_reflection) * t)
            # the reported colour follows whichever surface covers most of the
            # footprint, flipping exactly where the reflection is halfway
            if t < 0.5:
                return nearest.color, reflection, line_rgb
            return self.background, reflection, background_rgb

        return self.background, background_reflection, background_rgb

    def reflection_at(self, x: float, y: float) -> int:
        """Reflected light 0-100, as a real sensor with an aperture would read it."""
        return self.sample(x, y)[1]

    def rgb_at(self, x: float, y: float) -> tuple[int, int, int]:
        return self.sample(x, y)[2]

    def contains(self, x: float, y: float) -> bool:
        return 0 <= x <= self.width_mm and 0 <= y <= self.height_mm

    # -- ranging ------------------------------------------------------------

    def raycast(self, x: float, y: float, heading_deg: float, max_mm: float = 2000.0) -> float:
        """Distance to the nearest surface along a ray, or \`\`inf\`\` if clear."""
        angle = math.radians(heading_deg)
        dx, dy = math.cos(angle), math.sin(angle)

        best = math.inf
        for obstacle in self.obstacles:
            for x1, y1, x2, y2 in obstacle.segments():
                hit = _ray_segment(x, y, dx, dy, x1, y1, x2, y2)
                if hit is not None:
                    best = min(best, hit)

        if self.walls:
            for x1, y1, x2, y2 in (
                (0, 0, self.width_mm, 0),
                (self.width_mm, 0, self.width_mm, self.height_mm),
                (self.width_mm, self.height_mm, 0, self.height_mm),
                (0, self.height_mm, 0, 0),
            ):
                hit = _ray_segment(x, y, dx, dy, x1, y1, x2, y2)
                if hit is not None:
                    best = min(best, hit)

        return best if best <= max_mm else math.inf

    def blocked(self, x: float, y: float, radius: float) -> bool:
        """Would a robot of this radius overlap an obstacle or leave the mat?"""
        if not (radius <= x <= self.width_mm - radius and radius <= y <= self.height_mm - radius):
            return True
        for obstacle in self.obstacles:
            nearest_x = max(obstacle.x, min(x, obstacle.x + obstacle.width))
            nearest_y = max(obstacle.y, min(y, obstacle.y + obstacle.height))
            if math.hypot(x - nearest_x, y - nearest_y) < radius:
                return True
        return False

    # -- serialization ------------------------------------------------------

    @staticmethod
    def from_dict(data: dict) -> "World":
        return World(
            width_mm=data.get("width_mm", 2362.0),
            height_mm=data.get("height_mm", 1143.0),
            background=data.get("background", WHITE),
            lines=[
                LinePath(
                    points=[tuple(p) for p in line["points"]],
                    width_mm=line.get("width_mm", 20.0),
                    color=line.get("color", BLACK),
                )
                for line in data.get("lines", [])
            ],
            patches=[ColorPatch(**patch) for patch in data.get("patches", [])],
            obstacles=[Obstacle(**obs) for obs in data.get("obstacles", [])],
            walls=data.get("walls", True),
        )

    @staticmethod
    def load(path: str | Path) -> "World":
        return World.from_dict(json.loads(Path(path).read_text()))

    def to_dict(self) -> dict:
        return {
            "width_mm": self.width_mm,
            "height_mm": self.height_mm,
            "background": self.background,
            "lines": [
                {"points": [list(p) for p in l.points], "width_mm": l.width_mm, "color": l.color}
                for l in self.lines
            ],
            "patches": [vars(p) for p in self.patches],
            "obstacles": [vars(o) for o in self.obstacles],
            "walls": self.walls,
        }


def default_world() -> World:
    """A practice mat: one long black line with a gentle bend, and a wall to stop at."""
    return World(
        lines=[
            LinePath(
                # Starts inside the green square and finishes inside the red
                # one, so both ends of the line are visibly attached to
                # something rather than trailing off.
                points=[(200, 300), (900, 300), (1400, 600), (1900, 600)],
                width_mm=20.0,
            )
        ],
        patches=[
            # the target to stop on; the line ends inside it
            ColorPatch(x=1850, y=520, width=160, height=160, color=RED),
            # the start area the line comes out of. Its right edge is at
            # x=300, which is where the robot starts -- so the robot sits at
            # the edge of the square with its colour sensor, 70mm further
            # forward, already on plain black line. A line follower therefore
            # reads what it expects on its first tick.
            ColorPatch(x=140, y=220, width=160, height=160, color=GREEN),
        ],
        obstacles=[
            Obstacle(x=2100, y=450, width=60, height=300, name="end wall"),
        ],
    )


# --------------------------------------------------------------------------
# geometry helpers
# --------------------------------------------------------------------------

def _point_segment_distance(px, py, x1, y1, x2, y2) -> float:
    dx, dy = x2 - x1, y2 - y1
    length_sq = dx * dx + dy * dy
    if length_sq == 0:
        return math.hypot(px - x1, py - y1)
    t = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / length_sq))
    return math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))


def _ray_segment(ox, oy, dx, dy, x1, y1, x2, y2) -> float | None:
    """Distance from ray origin to its intersection with a segment, if any."""
    sx, sy = x2 - x1, y2 - y1
    denominator = dx * sy - dy * sx
    if abs(denominator) < 1e-9:
        return None  # parallel
    t = ((x1 - ox) * sy - (y1 - oy) * sx) / denominator
    u = ((x1 - ox) * dy - (y1 - oy) * dx) / denominator
    if t >= 0 and 0 <= u <= 1:
        return t
    return None
`};var m="0.28.0",u=`https://cdn.jsdelivr.net/pyodide/v${m}/full/`,h=`
import base64, sys
sys.path.insert(0, "/simulator")

from spike_sim.browser import BrowserHub

def _make(on_frame_js, on_message_js, speed, snapshot_interval):
    def on_frame(frame):
        # base64 rather than a buffer: see the note in simulator-worker.js
        on_frame_js(base64.b64encode(frame).decode("ascii"))

    hub = BrowserHub(
        on_frame,
        on_message_js,
        speed=speed,
        snapshot_interval=snapshot_interval,
    )

    def receive_b64(payload):
        hub.receive(base64.b64decode(payload))

    return hub, receive_b64
`,l=null,s=null,d=null,a=e=>self.postMessage(e),_=(e,n)=>a({type:"progress",stage:e,detail:n});async function g({indexURL:e=u,speed:n=1,snapshotInterval:t=.05}){_("loading","Downloading Python. This happens once.");let o=`${e}pyodide.mjs`,{loadPyodide:i}=await import(o);l=await i({indexURL:e}),_("unpacking","Unpacking the simulator."),b(l),_("starting","Starting the robot."),await l.runPythonAsync(h);let r=l.globals.get("_make"),c=r(f=>a({type:"frame",data:f}),f=>a({type:"message",data:f}),n,t);s=c.get(0),d=c.get(1),c.destroy(),r.destroy(),await s.start(),a({type:"ready"})}function b(e){e.FS.mkdirTree("/simulator/spike_sim");let n=new Set(["/simulator/spike_sim"]);for(let[t,o]of Object.entries(p)){let i=`/simulator/spike_sim/${t}`,r=i.slice(0,i.lastIndexOf("/"));n.has(r)||(e.FS.mkdirTree(r),n.add(r)),e.FS.writeFile(i,o,{encoding:"utf8"})}}async function y(){try{await s?.stop()}catch{}s?.destroy?.(),d?.destroy?.(),s=null,d=null}self.onmessage=async e=>{let{type:n,...t}=e.data??{};try{switch(n){case"start":await g(t);break;case"frame":d?.(t.data);break;case"command":s?.command(t.data);break;case"stop":await y(),a({type:"stopped"});break;default:break}}catch(o){a({type:"error",stage:n,message:o?.message??String(o)})}};
