/* Parse Action Language XML source into the action tree the engine
 * runs. Two passes: a first pass walks the parsed XML and registers
 * every <declare-function> definition in the FunctionRegistry, so
 * that recursive calls can resolve themselves; a second pass builds
 * the executable Action tree.
 *
 * The parser uses the browser's built-in DOMParser. That keeps the
 * bundle small and gets correct XML handling (entities, CDATA,
 * comments) for free, but means parsing is a client-side operation.
 * Server-side rendering of the four-pane UI passes the source as a
 * string and parses it in the browser when the user presses Run. */

import {
  Action,
  AddExpr,
  AssignVariableAction,
  CallExpr,
  DeclareVariableAction,
  EqExpr,
  Expression,
  type FunctionParam,
  FunctionAction,
  type FunctionRegistry,
  IfThenElseAction,
  LiteralExpr,
  LtExpr,
  PrintAction,
  ReadConstantExpr,
  ReadVariableExpr,
  SeqAction,
  SubtractExpr,
} from "./actions";
import type { ALType, ALValue } from "./types";

export interface ParseResult {
  /** The top-level executable action. */
  root: Action;
  /** Function definitions registered during the parse, keyed by
   *  name. The CallExpr instances inside the tree carry a
   *  reference to this registry so they can resolve calls at
   *  runtime. */
  registry: FunctionRegistry;
}

export function parseActionLanguage(source: string): ParseResult {
  const doc = parseXML(source);
  const registry: FunctionRegistry = new Map();

  // First pass: register every function definition so recursion
  // can resolve. We walk the whole tree and look for
  // <declare-function> elements; the actual body actions are
  // parsed in the second pass.
  const definitionElements: Element[] = [];
  walkElements(doc.documentElement, (el) => {
    if (el.tagName === "declare-function") {
      const name = requireAttr(el, "name");
      // Record a placeholder; the real Function gets built and
      // installed in pass 2.
      registry.set(name, null as unknown as FunctionAction);
      definitionElements.push(el);
    }
  });

  // Second pass: build the executable tree. Function bodies are
  // built first (so the registry has real entries before any call
  // gets parsed), then the top-level program.
  for (const el of definitionElements) {
    const fn = parseFunction(el, registry);
    registry.set(fn.funcName, fn);
  }
  const root = parseAction(doc.documentElement, registry);

  return { root, registry };
}

/* ------------- DOM walk helpers --------------------------------- */

function parseXML(source: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(source, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error(
      `XML parse error: ${errorNode.textContent ?? "unknown"}`,
    );
  }
  return doc;
}

function walkElements(el: Element, visit: (el: Element) => void): void {
  visit(el);
  for (const child of Array.from(el.children)) {
    walkElements(child, visit);
  }
}

function requireAttr(el: Element, name: string): string {
  const v = el.getAttribute(name);
  if (v === null) {
    throw new Error(
      `<${el.tagName}> missing required attribute '${name}'.`,
    );
  }
  return v;
}

function elementChildren(el: Element): Element[] {
  return Array.from(el.children);
}

/* ------------- Action / Expression dispatch --------------------- */

function parseAction(el: Element, registry: FunctionRegistry): Action {
  switch (el.tagName) {
    case "seq":
      return new SeqAction(
        elementChildren(el).map((c) => parseAction(c, registry)),
      );
    case "declare-function":
      // Function declarations don't execute at the top level — they
      // were registered in pass 1 and looked up by <call>. Treat as
      // a no-op when encountered in the action stream.
      return new SeqAction([]);
    case "declare-var": {
      const name = requireAttr(el, "name");
      const type = requireAttr(el, "type") as ALType;
      const valueChildren = elementChildren(el);
      const initial =
        valueChildren.length > 0
          ? parseExpression(valueChildren[0], registry)
          : undefined;
      return new DeclareVariableAction(name, type, initial);
    }
    case "assign": {
      const name = requireAttr(el, "name");
      const children = elementChildren(el);
      if (children.length !== 1) {
        throw new Error(`<assign> expects exactly one child expression.`);
      }
      return new AssignVariableAction(
        name,
        parseExpression(children[0], registry),
      );
    }
    case "print": {
      const children = elementChildren(el);
      if (children.length !== 1) {
        throw new Error(`<print> expects exactly one child expression.`);
      }
      return new PrintAction(parseExpression(children[0], registry));
    }
    case "if-then-else": {
      const children = elementChildren(el);
      if (children.length < 2 || children.length > 3) {
        throw new Error(
          `<if-then-else> expects 2 or 3 children (condition, then, [else]).`,
        );
      }
      return new IfThenElseAction(
        parseExpression(children[0], registry),
        parseAction(children[1], registry),
        children[2] ? parseAction(children[2], registry) : null,
      );
    }
    default:
      // If the element name isn't a recognised statement, try
      // treating it as an expression — useful at the top level
      // where the program might be a single expression rather
      // than a seq.
      return parseExpression(el, registry);
  }
}

function parseExpression(
  el: Element,
  registry: FunctionRegistry,
): Expression {
  switch (el.tagName) {
    case "literal": {
      const type = requireAttr(el, "type") as ALType;
      const raw = requireAttr(el, "value");
      const v = coerceLiteral(type, raw);
      return new LiteralExpr(type, v);
    }
    case "read-var":
      return new ReadVariableExpr(requireAttr(el, "name"));
    case "read-const":
      return new ReadConstantExpr(requireAttr(el, "name"));
    case "add":
      return new AddExpr(...binaryChildren(el, registry));
    case "subtract":
    case "sub":
      return new SubtractExpr(...binaryChildren(el, registry));
    case "lt":
      return new LtExpr(...binaryChildren(el, registry));
    case "eq":
      return new EqExpr(...binaryChildren(el, registry));
    case "call": {
      const name = requireAttr(el, "name");
      const args = elementChildren(el).map((c) =>
        parseExpression(c, registry),
      );
      return new CallExpr(name, args, registry);
    }
    case "if-then-else": {
      // Allow if-then-else as an expression too — its branches
      // can each be expressions, and the value of the chosen
      // branch is the value of the whole. This mirrors how the
      // Java reference's IF could appear in either context.
      const children = elementChildren(el);
      if (children.length !== 3) {
        throw new Error(
          `<if-then-else> as expression requires condition, then, else.`,
        );
      }
      // Wrap as a synthetic expression that delegates.
      const inner = new IfThenElseAction(
        parseExpression(children[0], registry),
        parseAction(children[1], registry),
        parseAction(children[2], registry),
      );
      return new IfThenElseExpr(inner);
    }
    default:
      throw new Error(`Unknown expression element: <${el.tagName}>`);
  }
}

function binaryChildren(
  el: Element,
  registry: FunctionRegistry,
): [Expression, Expression] {
  const children = elementChildren(el);
  if (children.length !== 2) {
    throw new Error(
      `<${el.tagName}> expects exactly two child expressions.`,
    );
  }
  return [
    parseExpression(children[0], registry),
    parseExpression(children[1], registry),
  ];
}

function parseFunction(
  el: Element,
  registry: FunctionRegistry,
): FunctionAction {
  const name = requireAttr(el, "name");
  const params: FunctionParam[] = [];
  let body: Action | null = null;
  for (const child of elementChildren(el)) {
    if (child.tagName === "param") {
      params.push({
        name: requireAttr(child, "name"),
        type: (child.getAttribute("type") as ALType) ?? "int",
      });
    } else {
      if (body !== null) {
        throw new Error(
          `<declare-function name="${name}"> may only contain one body action.`,
        );
      }
      body = parseAction(child, registry);
    }
  }
  if (body === null) {
    throw new Error(
      `<declare-function name="${name}"> must contain a body action.`,
    );
  }
  return new FunctionAction(name, params, body);
}

function coerceLiteral(type: ALType, raw: string): ALValue {
  switch (type) {
    case "int":
      return parseInt(raw, 10);
    case "double":
      return parseFloat(raw);
    case "boolean":
      return raw === "true" || raw === "1";
    case "string":
      return raw;
  }
}

/* IfThenElseExpr — wrap the action so it can also serve where an
 * Expression is required. The wrapped action's branches are each
 * supposed to be expressions in this context; the engine returns
 * whatever the chosen branch returns. */
class IfThenElseExpr extends Expression {
  readonly name = "IF_THEN_ELSE";
  constructor(public readonly inner: IfThenElseAction) {
    super();
  }
  override children(): Action[] {
    return this.inner.children();
  }
  execute(scope: Parameters<IfThenElseAction["execute"]>[0], ctx: Parameters<IfThenElseAction["execute"]>[1]) {
    return this.inner.execute(scope, ctx);
  }
}
