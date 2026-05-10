/* Top-level runner. Takes an Action Language XML source string,
 * parses it, executes the result, and returns the structured
 * outcome (output, trace, return value, error if any).
 *
 * The runner sets the call budget for recursion safety. The four-
 * pane UI calls this function on Run and renders the returned
 * trace step-by-step. */

import { type ExecutionContext } from "./actions";
import { parseActionLanguage } from "./parser";
import { newScope } from "./stacks";
import type { ExecutionResult, TraceEvent } from "./types";

export interface RunOptions {
  /** Maximum number of function calls before the runner aborts.
   *  Protects against runaway recursion in the browser tab.
   *  Default: 10,000 — comfortably handles fib(20) but stops fib
   *  from blowing the stack at large inputs. */
  callBudget?: number;
}

export function runActionLanguage(
  source: string,
  options: RunOptions = {},
): ExecutionResult {
  const trace: TraceEvent[] = [];
  const output: (string | number | boolean)[] = [];
  try {
    const { root } = parseActionLanguage(source);
    const scope = newScope();
    const ctx: ExecutionContext = {
      trace,
      output,
      depth: 0,
      budget: { calls: options.callBudget ?? 10_000 },
    };
    const returnValue = root.execute(scope, ctx);
    return { ok: true, output, trace, returnValue };
  } catch (err) {
    return {
      ok: false,
      output,
      trace,
      returnValue: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
