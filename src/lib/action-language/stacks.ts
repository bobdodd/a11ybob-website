/* Linked stacks for the Action Language engine. Mirrors the Java
 * reference's SMVariableStack / SMConstantStack / SMSetStack: each
 * scope has its own stack, and lookups walk up through the parent
 * chain when a name isn't found locally. This is what gives the
 * language lexical scoping with proper shadowing.
 *
 * The Java implementation kept variables, constants, and sets in
 * three separate stacks. We keep the same separation here so the
 * scoping semantics are identical: a variable cannot shadow a
 * constant of the same name, and vice-versa. */

import type { ALValue, ALType } from "./types";

export interface ALVariable {
  name: string;
  type: ALType;
  value: ALValue | null;
}

export interface ALConstant {
  name: string;
  type: ALType;
  /** Late-bound constants (function parameters) start with no
   *  value; the value is bound when the function is called. */
  value: ALValue | null;
  lateBound: boolean;
}

/** A single-scope linked stack. Each scope owns one of these for
 *  variables and one for constants. Lookups in a child scope fall
 *  through to the parent if the name isn't found locally. */
export class LinkedStack<T extends { name: string }> {
  private items: T[] = [];
  private parent: LinkedStack<T> | null = null;

  link(parent: LinkedStack<T> | null): void {
    this.parent = parent;
  }

  push(item: T): void {
    this.items.push(item);
  }

  /** Look up by name, walking up the parent chain. */
  find(name: string): T | null {
    for (const item of this.items) {
      if (item.name === name) return item;
    }
    return this.parent ? this.parent.find(name) : null;
  }

  /** Look up by name in this scope only — used to detect
   *  duplicate declarations. */
  findLocal(name: string): T | null {
    for (const item of this.items) {
      if (item.name === name) return item;
    }
    return null;
  }

  /** Snapshot of all variables visible from this scope, walking
   *  the parent chain. Used by the trace renderer when the user
   *  asks for the current state at a step. Local entries shadow
   *  parent entries with the same name. */
  snapshot(): T[] {
    const seen = new Set<string>();
    const out: T[] = [];
    // Collect from innermost scope outward; first occurrence wins.
    let scope: LinkedStack<T> | null = this;
    while (scope) {
      for (const item of scope.items) {
        if (!seen.has(item.name)) {
          seen.add(item.name);
          out.push(item);
        }
      }
      scope = scope.parent;
    }
    return out;
  }
}

/** Convenience aliases for the two stack flavours we use. */
export type VariableStack = LinkedStack<ALVariable>;
export type ConstantStack = LinkedStack<ALConstant>;

/** A single execution scope bundles the two stacks together so
 *  the action API can take a single `Scope` argument rather than
 *  passing the stacks separately the way the Java reference did. */
export interface Scope {
  variables: VariableStack;
  constants: ConstantStack;
}

/** Build a fresh empty scope. */
export function newScope(): Scope {
  return {
    variables: new LinkedStack<ALVariable>(),
    constants: new LinkedStack<ALConstant>(),
  };
}

/** Build a child scope linked to a parent — the standard pattern
 *  when entering a Seq, a Function body, or a control-flow
 *  branch. The child sees the parent's bindings but its own
 *  declarations don't leak back out. */
export function childScope(parent: Scope): Scope {
  const child = newScope();
  child.variables.link(parent.variables);
  child.constants.link(parent.constants);
  return child;
}
