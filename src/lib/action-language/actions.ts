/* The Action Language action hierarchy.
 *
 * The Java reference splits this across many files (one per action
 * type, organised into Block/Control/Math sub-packages). The TS
 * port keeps the same conceptual structure but collapses everything
 * into a single module — easier to read end-to-end, easier to grep,
 * and the file is still under a few hundred lines because the
 * actions themselves are small.
 *
 * Two base classes: Action returns nothing useful (statements);
 * Expression returns an ALValue (computed values). Every concrete
 * type has a name (used for the AST/trace UI) and an execute()
 * method that takes a Scope and a TraceCollector. */

import type { ALValue, ALType, TraceEvent } from "./types";
import {
  type Scope,
  childScope,
  type ALVariable,
  type ALConstant,
} from "./stacks";

/** The execution context passed down through every action. The
 *  TraceCollector receives every event the engine emits and the
 *  output buffer receives everything the program prints. depth
 *  tracks scope nesting for indentation in the trace UI. */
export interface ExecutionContext {
  trace: TraceEvent[];
  output: ALValue[];
  depth: number;
  /** Recursion limit so a runaway program can't lock the browser
   *  tab. Consumed by Function calls. */
  budget: { calls: number };
}

/** Resolution map for late-bound function definitions. The XML
 *  parser registers each <declare-function> here before evaluation
 *  starts; <call> looks the function up by name at runtime. */
export type FunctionRegistry = Map<string, FunctionAction>;

/** Base class for all actions. Carries a name (the type name —
 *  "SEQ", "ASSIGN", "ADD" — used in the trace UI) and offers the
 *  execute() hook concrete actions override. */
export abstract class Action {
  abstract readonly name: string;
  /** Execute this action under the given scope. Statements return
   *  void; expressions override with a return type. */
  abstract execute(scope: Scope, ctx: ExecutionContext): ALValue | null;
  /** Children, for the AST renderer. Concrete classes override. */
  children(): Action[] {
    return [];
  }
}

/** An expression: an action that returns a value. */
export abstract class Expression extends Action {
  abstract execute(scope: Scope, ctx: ExecutionContext): ALValue | null;
}

/* -------- Helpers ------------------------------------------------ */

function trace(
  ctx: ExecutionContext,
  event: Omit<Extract<TraceEvent, { kind: "enter" }>, "depth"> & { kind: "enter" }
    | Omit<Extract<TraceEvent, { kind: "exit" }>, "depth"> & { kind: "exit" }
    | Omit<Extract<TraceEvent, { kind: "evaluate" }>, "depth"> & { kind: "evaluate" }
    | Omit<Extract<TraceEvent, { kind: "assign" }>, "depth"> & { kind: "assign" }
    | Omit<Extract<TraceEvent, { kind: "print" }>, "depth"> & { kind: "print" }
    | Omit<Extract<TraceEvent, { kind: "stack" }>, "depth"> & { kind: "stack" },
): void {
  ctx.trace.push({ ...event, depth: ctx.depth } as TraceEvent);
}

function checkBudget(ctx: ExecutionContext): void {
  if (ctx.budget.calls <= 0) {
    throw new Error(
      "Execution budget exceeded — runaway recursion or infinite loop suspected.",
    );
  }
}

/* -------- Statements: Seq / Assign / Print / IfThenElse ---------- */

/** Sequential block. Creates a child scope, runs each child action
 *  in order, returns null. Mirrors SMSeq. */
export class SeqAction extends Action {
  readonly name = "SEQ";
  constructor(public readonly actions: Action[]) {
    super();
  }
  override children(): Action[] {
    return this.actions;
  }
  execute(scope: Scope, ctx: ExecutionContext): ALValue | null {
    const inner = childScope(scope);
    trace(ctx, { kind: "enter", action: "SEQ" });
    ctx.depth += 1;
    try {
      for (const action of this.actions) {
        action.execute(inner, ctx);
      }
    } finally {
      ctx.depth -= 1;
      trace(ctx, { kind: "exit", action: "SEQ" });
    }
    return null;
  }
}

/** Declare a variable in the local scope, with optional initial
 *  value. Mirrors SMDeclareVariable. */
export class DeclareVariableAction extends Action {
  readonly name = "DECLARE_VAR";
  constructor(
    public readonly varName: string,
    public readonly varType: ALType,
    public readonly initial?: Expression,
  ) {
    super();
  }
  override children(): Action[] {
    return this.initial ? [this.initial] : [];
  }
  execute(scope: Scope, ctx: ExecutionContext): null {
    if (scope.variables.findLocal(this.varName)) {
      throw new Error(
        `Variable '${this.varName}' already declared in this scope.`,
      );
    }
    let value: ALValue | null = null;
    if (this.initial) {
      value = this.initial.execute(scope, ctx);
    }
    const variable: ALVariable = {
      name: this.varName,
      type: this.varType,
      value,
    };
    scope.variables.push(variable);
    trace(ctx, { kind: "assign", name: this.varName, value });
    return null;
  }
}

/** Assign a value to an existing variable. Mirrors SMAssignVariable. */
export class AssignVariableAction extends Action {
  readonly name = "ASSIGN";
  constructor(
    public readonly varName: string,
    public readonly value: Expression,
  ) {
    super();
  }
  override children(): Action[] {
    return [this.value];
  }
  execute(scope: Scope, ctx: ExecutionContext): null {
    const variable = scope.variables.find(this.varName);
    if (!variable) {
      throw new Error(
        `Variable '${this.varName}' not found in any enclosing scope.`,
      );
    }
    const v = this.value.execute(scope, ctx);
    variable.value = v;
    trace(ctx, { kind: "assign", name: this.varName, value: v });
    return null;
  }
}

/** Read the value of a variable. */
export class ReadVariableExpr extends Expression {
  readonly name = "READ_VAR";
  constructor(public readonly varName: string) {
    super();
  }
  execute(scope: Scope, _ctx: ExecutionContext): ALValue | null {
    const variable = scope.variables.find(this.varName);
    if (!variable) {
      throw new Error(`Variable '${this.varName}' not found.`);
    }
    return variable.value;
  }
}

/** Read the value of a constant (function parameter). */
export class ReadConstantExpr extends Expression {
  readonly name = "READ_CONST";
  constructor(public readonly constName: string) {
    super();
  }
  execute(scope: Scope, _ctx: ExecutionContext): ALValue | null {
    const constant = scope.constants.find(this.constName);
    if (!constant) {
      throw new Error(`Constant '${this.constName}' not found.`);
    }
    return constant.value;
  }
}

/** Send a value to the output buffer. */
export class PrintAction extends Action {
  readonly name = "PRINT";
  constructor(public readonly value: Expression) {
    super();
  }
  override children(): Action[] {
    return [this.value];
  }
  execute(scope: Scope, ctx: ExecutionContext): null {
    const v = this.value.execute(scope, ctx);
    if (v !== null) ctx.output.push(v);
    trace(ctx, { kind: "print", value: v });
    return null;
  }
}

/** If-then-else. The condition expression must return a boolean.
 *  Mirrors SMIfThenElse. The else branch is optional. */
export class IfThenElseAction extends Action {
  readonly name = "IF_THEN_ELSE";
  constructor(
    public readonly condition: Expression,
    public readonly thenAction: Action,
    public readonly elseAction: Action | null,
  ) {
    super();
  }
  override children(): Action[] {
    const c: Action[] = [this.condition, this.thenAction];
    if (this.elseAction) c.push(this.elseAction);
    return c;
  }
  execute(scope: Scope, ctx: ExecutionContext): ALValue | null {
    trace(ctx, { kind: "enter", action: "IF" });
    ctx.depth += 1;
    try {
      const cond = this.condition.execute(scope, ctx);
      if (typeof cond !== "boolean") {
        throw new Error(
          `IF condition must evaluate to boolean, got ${typeof cond}.`,
        );
      }
      if (cond) {
        return this.thenAction.execute(scope, ctx);
      } else if (this.elseAction) {
        return this.elseAction.execute(scope, ctx);
      }
      return null;
    } finally {
      ctx.depth -= 1;
      trace(ctx, { kind: "exit", action: "IF" });
    }
  }
}

/** While loop. Mirrors SMWhileDo: condition expression evaluated
 *  before each iteration; body executes while it's true. Iteration
 *  cap shares the same call budget so a runaway loop can't lock
 *  the tab any more than runaway recursion can. */
export class WhileDoAction extends Action {
  readonly name = "WHILE";
  constructor(
    public readonly condition: Expression,
    public readonly body: Action,
  ) {
    super();
  }
  override children(): Action[] {
    return [this.condition, this.body];
  }
  execute(scope: Scope, ctx: ExecutionContext): null {
    trace(ctx, { kind: "enter", action: "WHILE" });
    ctx.depth += 1;
    try {
      while (true) {
        ctx.budget.calls -= 1;
        checkBudget(ctx);
        const cond = this.condition.execute(scope, ctx);
        if (typeof cond !== "boolean") {
          throw new Error(
            `WHILE condition must evaluate to boolean, got ${typeof cond}.`,
          );
        }
        if (!cond) break;
        this.body.execute(scope, ctx);
      }
    } finally {
      ctx.depth -= 1;
      trace(ctx, { kind: "exit", action: "WHILE" });
    }
    return null;
  }
}

/** A sequence whose value is the value of its final child. Mirrors
 *  SMSeqWithReturn in the Java reference. Useful as a function
 *  body when the function needs side effects (prints, assigns)
 *  followed by a returned value. Like Seq, runs in a child scope. */
export class SeqWithReturnExpr extends Expression {
  readonly name = "SEQ_RETURN";
  constructor(public readonly actions: Action[]) {
    super();
  }
  override children(): Action[] {
    return this.actions;
  }
  execute(scope: Scope, ctx: ExecutionContext): ALValue | null {
    if (this.actions.length === 0) {
      throw new Error("SEQ_RETURN requires at least one child action.");
    }
    const inner = childScope(scope);
    trace(ctx, { kind: "enter", action: "SEQ_RETURN" });
    ctx.depth += 1;
    let last: ALValue | null = null;
    try {
      for (const action of this.actions) {
        last = action.execute(inner, ctx);
      }
    } finally {
      ctx.depth -= 1;
      trace(ctx, { kind: "exit", action: "SEQ_RETURN" });
    }
    return last;
  }
}

/* -------- Expressions: Literal / Add / Subtract / Lt / Eq -------- */

export class LiteralExpr extends Expression {
  readonly name = "LITERAL";
  constructor(
    public readonly literalType: ALType,
    public readonly literalValue: ALValue,
  ) {
    super();
  }
  execute(_scope: Scope, ctx: ExecutionContext): ALValue {
    trace(ctx, {
      kind: "evaluate",
      action: "LITERAL",
      value: this.literalValue,
    });
    return this.literalValue;
  }
}

abstract class BinaryExpr extends Expression {
  constructor(
    public readonly left: Expression,
    public readonly right: Expression,
  ) {
    super();
  }
  override children(): Action[] {
    return [this.left, this.right];
  }
}

export class AddExpr extends BinaryExpr {
  readonly name = "ADD";
  execute(scope: Scope, ctx: ExecutionContext): ALValue {
    const l = this.left.execute(scope, ctx);
    const r = this.right.execute(scope, ctx);
    let v: ALValue;
    if (typeof l === "number" && typeof r === "number") {
      v = l + r;
    } else if (typeof l === "string" || typeof r === "string") {
      v = String(l) + String(r);
    } else {
      throw new Error(`ADD: incompatible types ${typeof l}, ${typeof r}`);
    }
    trace(ctx, { kind: "evaluate", action: "ADD", value: v });
    return v;
  }
}

export class SubtractExpr extends BinaryExpr {
  readonly name = "SUB";
  execute(scope: Scope, ctx: ExecutionContext): ALValue {
    const l = this.left.execute(scope, ctx);
    const r = this.right.execute(scope, ctx);
    if (typeof l !== "number" || typeof r !== "number") {
      throw new Error(`SUB: numeric types required`);
    }
    const v = l - r;
    trace(ctx, { kind: "evaluate", action: "SUB", value: v });
    return v;
  }
}

export class LtExpr extends BinaryExpr {
  readonly name = "LT";
  execute(scope: Scope, ctx: ExecutionContext): boolean {
    const l = this.left.execute(scope, ctx);
    const r = this.right.execute(scope, ctx);
    if (typeof l !== "number" || typeof r !== "number") {
      throw new Error(`LT: numeric types required`);
    }
    const v = l < r;
    trace(ctx, { kind: "evaluate", action: "LT", value: v });
    return v;
  }
}

export class EqExpr extends BinaryExpr {
  readonly name = "EQ";
  execute(scope: Scope, ctx: ExecutionContext): boolean {
    const l = this.left.execute(scope, ctx);
    const r = this.right.execute(scope, ctx);
    const v = l === r;
    trace(ctx, { kind: "evaluate", action: "EQ", value: v });
    return v;
  }
}

/* -------- Functions and calls ----------------------------------- */

export interface FunctionParam {
  name: string;
  type: ALType;
}

/** A function definition. Like SMFunction in the Java reference,
 *  this is itself an Expression — calling it evaluates the body in
 *  a fresh scope with the parameters bound as late-bound constants
 *  in that scope. */
export class FunctionAction extends Expression {
  readonly name = "FUNCTION";
  constructor(
    public readonly funcName: string,
    public readonly params: FunctionParam[],
    public readonly body: Action,
  ) {
    super();
  }
  override children(): Action[] {
    return [this.body];
  }
  /** Direct execution doesn't make sense for a function definition
   *  — you have to call it with arguments. The XML parser
   *  registers function definitions in the function registry; the
   *  CallExpr does the actual invocation. We implement execute()
   *  to satisfy the abstract base, but it always errors. */
  execute(): never {
    throw new Error(
      "Functions are invoked via <call>, not executed directly.",
    );
  }
  /** Invoke the function with already-evaluated argument values.
   *  Called by CallExpr. */
  invoke(
    args: (ALValue | null)[],
    callerScope: Scope,
    ctx: ExecutionContext,
  ): ALValue | null {
    if (args.length !== this.params.length) {
      throw new Error(
        `Function '${this.funcName}' expects ${this.params.length} args, got ${args.length}.`,
      );
    }
    ctx.budget.calls -= 1;
    checkBudget(ctx);
    const inner = childScope(callerScope);
    for (let i = 0; i < this.params.length; i++) {
      const constant: ALConstant = {
        name: this.params[i].name,
        type: this.params[i].type,
        value: args[i],
        lateBound: true,
      };
      inner.constants.push(constant);
    }
    trace(ctx, {
      kind: "enter",
      action: `CALL ${this.funcName}`,
      detail: this.params
        .map((p, i) => `${p.name}=${formatValue(args[i])}`)
        .join(", "),
    });
    ctx.depth += 1;
    try {
      const result = this.body.execute(inner, ctx);
      trace(ctx, {
        kind: "evaluate",
        action: `RETURN ${this.funcName}`,
        value: result,
      });
      return result;
    } finally {
      ctx.depth -= 1;
      trace(ctx, { kind: "exit", action: `CALL ${this.funcName}` });
    }
  }
}

/** Call a function by name, with argument expressions that get
 *  evaluated in the caller's scope before the function body runs.
 *  Resolves the function via the FunctionRegistry the parser
 *  populated. */
export class CallExpr extends Expression {
  readonly name = "CALL";
  constructor(
    public readonly funcName: string,
    public readonly args: Expression[],
    public readonly registry: FunctionRegistry,
  ) {
    super();
  }
  override children(): Action[] {
    return this.args;
  }
  execute(scope: Scope, ctx: ExecutionContext): ALValue | null {
    const fn = this.registry.get(this.funcName);
    if (!fn) throw new Error(`Function '${this.funcName}' not defined.`);
    const args = this.args.map((a) => a.execute(scope, ctx));
    return fn.invoke(args, scope, ctx);
  }
}

function formatValue(v: ALValue | null): string {
  if (v === null) return "null";
  return String(v);
}
