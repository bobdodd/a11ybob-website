/* Canonical XML source for each Action Language worked example.
 * Held as plain string constants so the server-rendered page can
 * pass them down as props to the client-rendered ALPlayground
 * (the engine and CodeMirror are browser-only). */

export const FIBONACCI_XML = `<seq>
  <!-- Recursive Fibonacci. Function parameters are late-bound
       constants in the function's local scope; the body is the
       single expression returned by the call. -->
  <declare-function name="fib">
    <param name="n" type="int"/>
    <if-then-else>
      <lt>
        <read-const name="n"/>
        <literal type="int" value="2"/>
      </lt>
      <read-const name="n"/>
      <add>
        <call name="fib">
          <subtract>
            <read-const name="n"/>
            <literal type="int" value="1"/>
          </subtract>
        </call>
        <call name="fib">
          <subtract>
            <read-const name="n"/>
            <literal type="int" value="2"/>
          </subtract>
        </call>
      </add>
    </if-then-else>
  </declare-function>

  <!-- Print fib(0) through fib(9). Each iteration evaluates the
       call expression and pushes the result to the output buffer.
       Try changing the upper bound; values past 20 start to slow
       noticeably (recursive fib is exponential). -->
  <print><call name="fib"><literal type="int" value="0"/></call></print>
  <print><call name="fib"><literal type="int" value="1"/></call></print>
  <print><call name="fib"><literal type="int" value="2"/></call></print>
  <print><call name="fib"><literal type="int" value="3"/></call></print>
  <print><call name="fib"><literal type="int" value="4"/></call></print>
  <print><call name="fib"><literal type="int" value="5"/></call></print>
  <print><call name="fib"><literal type="int" value="6"/></call></print>
  <print><call name="fib"><literal type="int" value="7"/></call></print>
  <print><call name="fib"><literal type="int" value="8"/></call></print>
  <print><call name="fib"><literal type="int" value="9"/></call></print>
</seq>`;

/* Example 2 — Conditional content selection.
 *
 * The accessibility-shaped if-then-else: pick a presentation
 * metaphor based on a user-capability variable. The same code
 * runs twice, once for each modality, to make the branching
 * visible in the trace. */
export const CONDITIONAL_CONTENT_XML = `<seq>
  <!-- A present-content function that picks a metaphor based on
       the user's modality. The same call runs differently for
       different profiles. The polymorphism is in the data
       (modality), not in the call site. -->
  <declare-function name="present">
    <param name="modality" type="string"/>
    <if-then-else>
      <eq>
        <read-const name="modality"/>
        <literal type="string" value="vision"/>
      </eq>
      <print>
        <literal type="string" value="rendering: visual metaphor (button with focus ring)"/>
      </print>
      <if-then-else>
        <eq>
          <read-const name="modality"/>
          <literal type="string" value="sonic"/>
        </eq>
        <print>
          <literal type="string" value="rendering: sonic metaphor (earcon plus voice label)"/>
        </print>
        <print>
          <literal type="string" value="rendering: fallback text label"/>
        </print>
      </if-then-else>
    </if-then-else>
  </declare-function>

  <!-- Two users, two profiles. Same content, different
       presentations. Try changing one of the modality strings
       to "haptic" to see the fallback branch fire. -->
  <print><literal type="string" value="user A:"/></print>
  <call name="present">
    <literal type="string" value="vision"/>
  </call>

  <print><literal type="string" value="user B:"/></print>
  <call name="present">
    <literal type="string" value="sonic"/>
  </call>
</seq>`;

/* Example 3 — SM-style state migration.
 *
 * The notification lifecycle from the doctoral framework's
 * Methodology chapter: Announcing → Dwelling → Expiring → Gone.
 * The notification is the same instance through the transitions;
 * what changes is its subtype (its role). Each role renders
 * differently. The role migration is what disjoint-complete
 * subtyping in Shlaer-Mellor models — same supertype instance,
 * exactly one subtype at a time, transitions between them as the
 * lifecycle advances.
 *
 * In this minimal AL we model the state with a string variable
 * and the per-state rendering with an if-cascade. A real SM
 * implementation would use disjoint-complete subtypes; the shape
 * of the iteration is the same either way. */
export const STATE_MIGRATION_XML = `<seq>
  <!-- Render the current state. Each branch is what the role-
       specific rendering would do for that subtype. -->
  <declare-function name="render">
    <param name="state" type="string"/>
    <if-then-else>
      <eq>
        <read-const name="state"/>
        <literal type="string" value="announcing"/>
      </eq>
      <print><literal type="string" value="[ANNOUNCING] audible chime + visual badge"/></print>
      <if-then-else>
        <eq>
          <read-const name="state"/>
          <literal type="string" value="dwelling"/>
        </eq>
        <print><literal type="string" value="[DWELLING] reduced presence, available on demand"/></print>
        <if-then-else>
          <eq>
            <read-const name="state"/>
            <literal type="string" value="expiring"/>
          </eq>
          <print><literal type="string" value="[EXPIRING] suppressed; final cue"/></print>
          <print><literal type="string" value="[GONE]"/></print>
        </if-then-else>
      </if-then-else>
    </if-then-else>
  </declare-function>

  <!-- Compute the next state from the current one. Returns a
       new state string; the variable in the loop body assigns
       it back. -->
  <declare-function name="advance">
    <param name="state" type="string"/>
    <if-then-else>
      <eq>
        <read-const name="state"/>
        <literal type="string" value="announcing"/>
      </eq>
      <literal type="string" value="dwelling"/>
      <if-then-else>
        <eq>
          <read-const name="state"/>
          <literal type="string" value="dwelling"/>
        </eq>
        <literal type="string" value="expiring"/>
        <literal type="string" value="gone"/>
      </if-then-else>
    </if-then-else>
  </declare-function>

  <!-- The notification's lifecycle. The variable holds the
       current subtype name; each tick renders, then advances.
       The loop terminates when the role reaches "gone" — the
       point at which the notification has migrated out of every
       active subtype. -->
  <declare-var name="state" type="string">
    <literal type="string" value="announcing"/>
  </declare-var>

  <while>
    <eq>
      <eq>
        <read-var name="state"/>
        <literal type="string" value="gone"/>
      </eq>
      <literal type="boolean" value="false"/>
    </eq>
    <seq>
      <call name="render"><read-var name="state"/></call>
      <assign name="state">
        <call name="advance"><read-var name="state"/></call>
      </assign>
    </seq>
  </while>

  <print><literal type="string" value="(notification destroyed)"/></print>
</seq>`;

/* Example 4 — Adaptation: a button rollover that adapts its
 * inventory-to-semantics mapping for visual vs sonic user
 * profiles. The same event (USER ENTERS PROXIMITY OF NODE)
 * triggers different concrete realisations; the abstract
 * domain — "the button became hover-active" — is the same in
 * both cases.
 *
 * This is the structure that the CISNA Adaptation Model is for:
 * an event in the underlying interface gets bridged through to
 * different inventory selections per user-platform, and the
 * same source of truth produces different output. */
export const ADAPTATION_XML = `<seq>
  <!-- The visual concrete realisation. The inventory item
       picked is the visual hover affordance (focus ring + tooltip);
       semantics: "the button is hover-active". The function body
       is a seq-return so the function value is the final
       expression after the prints have run. -->
  <declare-function name="render-visual">
    <seq-return>
      <print><literal type="string" value="[visual] focus ring engages"/></print>
      <print><literal type="string" value="[visual] tooltip text fades in"/></print>
      <literal type="string" value="hover-active"/>
    </seq-return>
  </declare-function>

  <!-- The sonic concrete realisation. The inventory item picked
       is the sonic hover affordance (earcon + spoken label);
       same semantics — "the button is hover-active". -->
  <declare-function name="render-sonic">
    <seq-return>
      <print><literal type="string" value="[sonic] short earcon (250 ms)"/></print>
      <print><literal type="string" value="[sonic] spoken label: button name"/></print>
      <literal type="string" value="hover-active"/>
    </seq-return>
  </declare-function>

  <!-- The adaptation bridge. USER ENTERS PROXIMITY OF NODE is
       the abstract event; this function is the model compiler
       that picks the right concrete realisation for the user's
       profile. -->
  <declare-function name="on-proximity">
    <param name="profile" type="string"/>
    <if-then-else>
      <eq>
        <read-const name="profile"/>
        <literal type="string" value="visual"/>
      </eq>
      <call name="render-visual"/>
      <call name="render-sonic"/>
    </if-then-else>
  </declare-function>

  <!-- The same event, twice, against two different user
       profiles. Same semantics emerge ("hover-active" returned
       in both cases) from different inventory selections. -->
  <print><literal type="string" value="--- user A (visual profile) ---"/></print>
  <print><call name="on-proximity"><literal type="string" value="visual"/></call></print>

  <print><literal type="string" value="--- user B (sonic profile) ---"/></print>
  <print><call name="on-proximity"><literal type="string" value="sonic"/></call></print>
</seq>`;
