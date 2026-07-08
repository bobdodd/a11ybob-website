import Link from "next/link";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";

export default function ParadiseActionLanguage() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ParadiseSubNav />
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>ActionLanguage IR</h1>
            <p className="lede">
              The intermediate representation (IR) Paradise builds for
              JavaScript. A tree of actions describing{" "}
              <em>what the program does</em>, not the syntax of how it
              was written. Two semantically-equivalent JavaScript
              fragments collapse to the same ActionLanguage tree;
              accessibility analysis becomes a question about behaviour,
              not about spelling.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why a tree of actions, not an AST</h2>
            <p>
              An abstract syntax tree captures syntactic structure — the
              shape of what was typed. A JavaScript AST for{" "}
              <code>button.addEventListener(&quot;click&quot;, fn)</code>
              {" "}is an <code>ExpressionStatement</code>{" "}wrapping a{" "}
              <code>CallExpression</code>{" "}on a{" "}
              <code>MemberExpression</code>{" "}with two arguments. That
              shape is correct, but it&rsquo;s not what the
              accessibility question is about. The question is about
              the behaviour: <em>is there a click handler on this
              element, and is it also reachable by keyboard?</em>
            </p>
            <p>
              The ActionLanguage tree captures behaviour directly. The
              same call becomes a <em>register-handler</em>{" "}action
              whose attributes name the target selector, the event
              type, and the body of effects the handler performs. That
              representation answers the accessibility question in one
              hop — the analyser doesn&rsquo;t have to recover the
              meaning of the AST shape; the meaning is already there.
            </p>
            <p>
              The form descends directly from work I started in 2010 on
              adaptive user interfaces — see{" "}
              <Link href="/paradise/lineage">Lineage</Link>. The PhD-era
              Action Language Model was designed to describe
              algorithm fragments precisely enough that they could be
              substituted at runtime. The same precision is what makes
              accessibility behaviour analysable.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The model in seven entities</h2>
            <p>
              The model has a small, deliberate vocabulary. Every
              ActionLanguage tree decomposes into instances of these:
            </p>
            <dl
              className="stack"
              style={{ "--space": "var(--s-1)" } as CSSProperties}
            >
              <div>
                <dt>
                  <strong>Action</strong>
                </dt>
                <dd>
                  A node in the tree. The basic executable unit. Every
                  action has a type and zero or more typed attributes;
                  some have ordered child actions.
                </dd>
              </div>
              <div>
                <dt>
                  <strong>ActionType</strong>
                </dt>
                <dd>
                  The kind of action — <code>seq</code>, <code>if</code>,{" "}
                  <code>for</code>, <code>register-handler</code>,{" "}
                  <code>mutate-style</code>, and so on. Defines which
                  attribute types the action carries and whether it can
                  contain children.
                </dd>
              </div>
              <div>
                <dt>
                  <strong>ActionAttribute</strong>
                </dt>
                <dd>
                  A typed attribute on an action — a variable name on
                  an <code>assign</code>, the literal value on a{" "}
                  <code>literal</code>, the selector string on a{" "}
                  <code>register-handler</code>.
                </dd>
              </div>
              <div>
                <dt>
                  <strong>AttributeType</strong>
                </dt>
                <dd>
                  The kind of attribute — <code>var.name</code>,{" "}
                  <code>literal.string</code>, <code>selector</code>,{" "}
                  <code>event.name</code>. Defines the data type the
                  attribute carries.
                </dd>
              </div>
              <div>
                <dt>
                  <strong>AttributeDataType</strong>
                </dt>
                <dd>
                  The data type — <code>String</code>,{" "}
                  <code>Integer</code>, <code>Boolean</code>,{" "}
                  <code>Selector</code>. Two attributes of different
                  data types can&rsquo;t be confused for each other in
                  analysis.
                </dd>
              </div>
              <div>
                <dt>
                  <strong>SequencedAction</strong>
                </dt>
                <dd>
                  The relationship that holds one action as a child of
                  another in a specific position. Sequencing matters —
                  <code> a; b</code>{" "}is not the same as <code>b; a</code>{" "}
                  for many accessibility patterns (focus management
                  ordering, ARIA-state updates).
                </dd>
              </div>
              <div>
                <dt>
                  <strong>ActionColoring</strong>
                </dt>
                <dd>
                  The link between an action and its type — &ldquo;this
                  node is of type <em>register-handler</em>&rdquo;.
                  Separating coloring from the action itself made the
                  PhD-era execution engine easier to reason about; it
                  carries over here mostly out of fidelity to the
                  original model.
                </dd>
              </div>
            </dl>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Worked example</h2>
            <p>
              A small handler that opens a modal and traps focus. The
              JavaScript that&rsquo;s typed:
            </p>
            <pre>
              <code>{JS_EXAMPLE}</code>
            </pre>
            <p>
              The JavaScript AST for that fragment is the syntactic
              shape — call expressions, arrow functions, member
              expressions. It says <em>what was written</em>:
            </p>
            <pre>
              <code>{AST_EXAMPLE}</code>
            </pre>
            <p>
              The ActionLanguage tree for the same fragment says{" "}
              <em>what it does</em>:
            </p>
            <pre>
              <code>{AL_EXAMPLE}</code>
            </pre>
            <p>
              Three things have happened in the translation. First, the
              syntactic noise of <code>addEventListener</code>{" "}as a
              method call has collapsed into the action type{" "}
              <code>register-handler</code> — one node that names the
              behaviour directly. Second, the arrow-function body has
              been broken out into the <em>effects</em>{" "}that occur when
              the handler fires, with each effect typed by what kind of
              side-effect it has — a style mutation here, a function
              call there. Third, the targets have been resolved to
              selectors — <code>#openBtn</code>{" "}for the registration
              site, <code>#modal</code>{" "}for the style mutation — so the
              DocumentModel can match them against elements in the
              DOMModel and CSSModel.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the IR adds</h2>
            <ul>
              <li>
                <strong>Behavioural typing.</strong>{" "}Every action is one
                of a small set of types named by the effect it has —{" "}
                <em>register-handler</em>, <em>mutate-style</em>,{" "}
                <em>mutate-attribute</em>, <em>set-focus</em>,{" "}
                <em>conditional</em>, <em>iteration</em>. Querying for
                &ldquo;every place that moves focus&rdquo; is one
                tree-walk; doing the same on a JavaScript AST means
                pattern-matching across many syntactic forms.
              </li>
              <li>
                <strong>Selector resolution.</strong>{" "}Targets in the
                tree are CSS selectors, not opaque strings. The IR
                doesn&rsquo;t care whether the source code wrote{" "}
                <code>document.getElementById(&quot;x&quot;)</code>{" "}or{" "}
                <code>document.querySelector(&quot;#x&quot;)</code>{" "}or{" "}
                <code>elementsById.x</code> — they all resolve to the
                same selector, and the same element in the DOMModel.
              </li>
              <li>
                <strong>Cross-handler reasoning.</strong>{" "}Two handlers
                registered on the same selector — say a click handler
                and a keydown handler — produce two register-handler
                nodes with the same target. An analyser can compare the
                effects of both nodes to ask whether the keyboard path
                is equivalent to the pointer path.
              </li>
              <li>
                <strong>Source provenance.</strong>{" "}Every node carries
                the source file and line range it came from, so
                analyser diagnostics can point back to the exact lines
                the developer wrote. The IR is abstract about
                semantics, not about location.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the IR discards</h2>
            <ul>
              <li>
                <strong>Syntactic spelling.</strong>{" "}
                <code>function f() {"{"} return 1; {"}"}</code>{" "}and{" "}
                <code>const f = () =&gt; 1;</code>{" "}collapse to the same
                tree. The accessibility analyser doesn&rsquo;t care
                which form the developer chose.
              </li>
              <li>
                <strong>Comments and whitespace.</strong>{" "}The IR
                doesn&rsquo;t carry presentation; the source location
                preserves where the original was, which is what
                diagnostics need.
              </li>
              <li>
                <strong>Optimisation-friendly transforms.</strong>{" "}The
                IR is the source author&rsquo;s intent, not the engine
                runner&rsquo;s. Constant folding, dead-code elimination,
                inlining — none of those happen in the IR. Paradise
                analyses what was written, not what a JIT would run.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The Adaptation Model</h2>
            <p>
              In the PhD-era work the Action Language Model had a twin:
              the <em>Adaptation Model</em>, which described variations
              between algorithm versions as <em>add</em>,{" "}
              <em>modify</em>, and <em>delete</em>{" "}operations on action
              nodes. The original use case was substituting algorithm
              fragments at runtime to suit a particular user.
            </p>
            <p>
              The Adaptation Model isn&rsquo;t used in current Paradise.
              It&rsquo;s on the roadmap because it answers a different
              kind of accessibility question: &ldquo;what is the
              minimum modification that would make this code accessible
              for a particular user&rsquo;s capability profile?&rdquo;.
              That direction belongs to the post-2029 framework I plan
              to take up — see <Link href="/paradise/lineage">Lineage</Link>{" "}
              for the longer story.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/paradise/architecture">Architecture</Link>{" "}
                — how the ActionLanguage tree fits into the multi-model
                composition.
              </li>
              <li>
                <Link href="/paradise/lineage">Lineage</Link> — the
                research origin of the IR shape.
              </li>
              <li>
                <Link href="/paradise">Back to Paradise</Link>.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

const JS_EXAMPLE = `// JavaScript source
openBtn.addEventListener("click", () => {
  modal.style.display = "block";
  trapFocus(modal);
});`;

const AST_EXAMPLE = `// JavaScript AST (simplified)
ExpressionStatement
  CallExpression
    callee: MemberExpression
      object: Identifier("openBtn")
      property: Identifier("addEventListener")
    arguments:
      Literal("click")
      ArrowFunctionExpression
        body: BlockStatement
          ExpressionStatement
            AssignmentExpression
              left: MemberExpression
                object: MemberExpression
                  object: Identifier("modal")
                  property: Identifier("style")
                property: Identifier("display")
              right: Literal("block")
          ExpressionStatement
            CallExpression
              callee: Identifier("trapFocus")
              arguments: [Identifier("modal")]`;

const AL_EXAMPLE = `// ActionLanguage tree (simplified)
register-handler
  target:    selector(#openBtn)
  event:     click
  effects:
    mutate-style
      target:   selector(#modal)
      property: display
      value:    "block"
    call
      function: trapFocus
      args:     [selector(#modal)]`;
