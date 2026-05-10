/* Shared types for the Action Language engine.
 *
 * The engine is a TypeScript port of the Carnforth Java reference
 * implementation. The Java reference treats the action tree as the
 * stored program of a Forth-style threaded interpreter; this port
 * keeps that execution model and adds a structured trace that the
 * four-pane UI can render step-by-step rather than relying on
 * System.out.println.
 *
 * No Java is bundled with the site; the Java reference is read for
 * behaviour only. */

/** Primitive value types the engine carries. Matches what the Java
 *  reference supports: integers, doubles, strings, booleans. */
export type ALValue = number | string | boolean;

/** Primitive type tag used in literals and declarations. */
export type ALType = "int" | "double" | "string" | "boolean";

/** A trace event emitted during execution. The runner collects
 *  these in order and the UI renders them in the trace pane.
 *
 *  - "enter" / "exit" bracket a structural action (a seq, a
 *    function body, an if branch). The depth field gives the
 *    current scope depth so the UI can indent.
 *  - "evaluate" reports the result of an expression (the value
 *    computed). The action name and the value land together.
 *  - "assign" reports a variable assignment.
 *  - "print" reports a value sent to output.
 *  - "stack" reports the current variable stack snapshot at a
 *    point of interest. Most useful when the user wants to see
 *    the state at a specific step. */
export type TraceEvent =
  | { kind: "enter"; action: string; depth: number; detail?: string }
  | { kind: "exit"; action: string; depth: number; detail?: string }
  | { kind: "evaluate"; action: string; depth: number; value: ALValue | null }
  | {
      kind: "assign";
      depth: number;
      name: string;
      value: ALValue | null;
    }
  | { kind: "print"; depth: number; value: ALValue | null }
  | {
      kind: "stack";
      depth: number;
      variables: { name: string; value: ALValue | null }[];
    };

/** The full result of running an Action Language program. */
export interface ExecutionResult {
  /** What was sent to print, in order. */
  output: ALValue[];
  /** The structured execution trace. */
  trace: TraceEvent[];
  /** The value the top-level action evaluated to (if any). */
  returnValue: ALValue | null;
  /** True if execution completed without an engine error. */
  ok: boolean;
  /** Set when ok is false. */
  error?: string;
}
