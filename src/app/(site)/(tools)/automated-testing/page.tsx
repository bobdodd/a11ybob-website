import Link from "next/link";
import type { CSSProperties } from "react";

/* /automated-testing — five proof-of-concept accessibility-AI
 * demonstrations. The prompts, responses, and discussion text
 * are the captured versions from the source repo
 * (github.com/bobdodd/automated-testing, formerly bobdodd/a11yAuto)
 * and are reproduced verbatim with only light typo correction for
 * readability. PoC framing per the plan: this page is research-
 * in-progress, not a tool catalogue. */

export default function AutomatedTesting() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Automated accessibility testing</h1>
            <p className="lede">
              Five proof-of-concept demonstrations of AI-driven
              accessibility testing &mdash; the territory commercial
              automated scanners cannot reach. Each demo applies
              Claude Opus to a specific class of accessibility
              issue, with the exact prompt, the captured Claude
              response, and an honest discussion of what worked
              and what did not. Open-source GPL-3.0 at{" "}
              <a href="https://github.com/bobdodd/automated-testing">
                github.com/bobdodd/automated-testing
              </a>{" "}
              (the project was originally named <code>a11yAuto</code>;
              renamed in May 2026 to make the content more legible).
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What this page is &mdash; and what it isn&rsquo;t</h2>
            <p>
              <em>
                These are exploratory experiments, not 
                commercial-tool replacements.
              </em>{" "}
              The page demonstrates that the AI-driven approach
              works for some categories of accessibility issue that
              classic automated tooling cannot find &mdash; and is
              honest about where the approach is currently fragile.
              The strongest reading of this page is{" "}
              <em>
                &ldquo;Bob explores AI-for-accessibility
                carefully, with worked examples, and tells you
                where the approach succeeds and where it
                fails.&rdquo;
              </em>{" "}
              The strongest reading is not{" "}
              <em>
                &ldquo;Bob has built AI accessibility tools that
                work in production.&rdquo;
              </em>{" "}
              That distinction matters, both for the integrity of
              the Oracle frame and for not getting caught
              overclaiming.
            </p>
            <p>
              Each demo follows the same shape: what the test
              attempts to detect; which WCAG success criteria are
              involved; the prompt verbatim from the upstream
              repository; the captured Claude response that the
              prompt produced; and a discussion section where the
              PoC honesty actually lives &mdash; what worked, what
              didn&rsquo;t, and what would need to be done before
              this could be used in real audit work.
            </p>
            <p>
              The test page for every demo is{" "}
              <em>InaccessibilityMatters</em>, a 
              deliberately-broken site purpose-built to exercise specific
              accessibility failures. It currently lives at{" "}
              <code>bobd69.sg-host.com</code>{" "}pending migration off
              SiteGround to{" "}
              <code>inaccessibility-matters.a11ybob.com</code>. The
              prompts here all use the rendered HTML of that page
              plus, where relevant, a screenshot.
            </p>
            <p>
              <em>
                The captured prompt-and-response on each demo is
                always visible without any input. The plan calls
                for an optional bring-your-own-key panel that lets
                visitors re-run a demo against a different URL
                with their own Anthropic API key &mdash; that
                panel is on the roadmap; the captured demos are
                the substance the page exists for.
              </em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Relationship to the rest of the tooling</h2>
            <p>
              Three different approaches to accessibility testing,
              all Bob-owned, all open-source, each with its own
              scope and limits:
            </p>
            <ul>
              <li>
                <Link href="/carnforth">Carnforth</Link>{" "}&mdash;
                a runtime Chrome extension that tests the rendered
                DOM against the live page. Browser-side, no
                network round-trips, written in plain JavaScript.
              </li>
              <li>
                <strong>automated-testing (this page)</strong>{" "}
                &mdash; AI-driven testing applied to specific
                classes of issue commercial tools cannot reach.
                Five PoCs, explicitly experimental, with discussion
                of where each is fragile.
              </li>
              <li>
                <Link href="/paradise">Paradise</Link>{" "}&mdash;
                source-level multi-model analysis. Parses HTML,
                JavaScript, and CSS into separate semantic models;
                reasons over the integrated structure. The most
                technically substantive of the three; sits at the
                opposite end of the spectrum from automated-testing
                in terms of methodology.
              </li>
            </ul>
            <p>
              All three connect to the longer arc: the{" "}
              <Link href="/research/2029-framework">
                2029 framework
              </Link>{" "}
              is the theoretical end of the research line whose
              practical present-day end the automated-testing PoCs
              probe. The PoCs identify where AI testing can
              plausibly add value beyond commercial tools, and
              where the approach is currently fragile. The 2029
              work would build out the formal structure that makes
              this kind of testing systematic rather than ad-hoc.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
            aria-labelledby="demo-language-heading"
          >
            <h2 id="demo-language-heading">
              Demo 1: Language detection from text content
            </h2>

            <h3>What this test attempts to detect</h3>
            <p>
              The dominant language of a web page, detected from
              the actual text content rather than from the HTML{" "}
              <code>lang</code>{" "}attribute, compared against the{" "}
              <code>lang</code>{" "}attribute to see if the
              declaration is correct. Also detects words in
              languages other than the dominant one, and checks
              whether they are correctly wrapped in their own{" "}
              <code>lang</code>{" "}attributes.
            </p>
            <p>
              Commercial automated tools do not test for this; they
              check whether <code>lang</code>{" "}is present, not
              whether it is accurate. A page declared as French
              but written entirely in English passes their checks.
              This demo catches that case.
            </p>

            <h3>WCAG criteria</h3>
            <ul>
              <li>
                <strong>3.1.1 Language of Page</strong>{" "}(Level A)
              </li>
              <li>
                <strong>3.1.2 Language of Parts</strong>{" "}(Level
                AA)
              </li>
            </ul>

            <h3>The prompt</h3>
            <pre>
              <code>{LANGUAGE_PROMPT}</code>
            </pre>
            <p className="muted">
              <small>
                Followed by the rendered HTML of the test page.
                Full prompt &mdash; HTML included &mdash; lives in
                the upstream repository.
              </small>
            </p>

            <h3>Claude&rsquo;s response</h3>
            <pre>
              <code>{LANGUAGE_RESPONSE}</code>
            </pre>

            <h3>Discussion</h3>
            <p>
              The goal is to test a page for WCAG 3.1.1 (Language
              of Page) and 3.1.2 (Language of Parts) by detecting
              the dominant language from the actual text rather
              than from the syntax of the <code>lang</code>{" "}
              attribute &mdash; going beyond the classic automated
              testing currently available.
            </p>
            <p>
              The prompt queries the embedded HTML of a web page.
              That HTML is, in this case, copied by inspecting
              the rendered web page using the Chrome dev tools and
              copying the element.
            </p>
            <p>
              Claude&rsquo;s HTML knowledge is used to identify the
              text content of the page and identify the dominant
              language of that text. On this page that is English.
              The declared language of the page is{" "}
              <code>fr</code>. Claude is asked to compare the two
              and report the mismatch; it does. Claude is also
              asked to identify any words not in the dominant
              language &mdash; the language switcher contains
              French and Spanish &mdash; and to check whether
              those words are wrapped in their own{" "}
              <code>lang</code>{" "}attributes. They are not, and
              Claude reports that as well, with a remediation
              example.
            </p>
            <p>
              <strong>The most reliable of the five demos.</strong>{" "}
              Language detection is something LLMs do well; the
              comparison-with-declared-attribute is mechanical;
              the remediation suggestion is sound. This is the
              cleanest example of AI testing finding something
              commercial tools currently cannot.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
            aria-labelledby="demo-headings-heading"
          >
            <h2 id="demo-headings-heading">
              Demo 2: Headings that should be there, and headings
              that have gone missing
            </h2>

            <h3>What this test attempts to detect</h3>
            <p>
              Two complementary failure modes. (a) Apparent
              headings on the rendered page that are not marked up
              as headings in the HTML. (b) Marked-up headings in
              the HTML that are not visible on the rendered page
              &mdash; either deliberately hidden, or obscured by
              other content. Classic automated tools test the
              semantics that are <em>there</em>; they do not find
              the semantics that should be there but aren&rsquo;t,
              nor the markup that is overridden by layout.
            </p>
            <p>
              The test combines image recognition (what looks like
              a heading on the page) with HTML parsing (what is
              actually marked up). The mismatches are the
              accessibility failures.
            </p>

            <h3>WCAG criteria</h3>
            <ul>
              <li>
                <strong>1.3.1 Info and Relationships</strong>{" "}
                (Level A) &mdash; unmarked-up headings, headings
                out of order
              </li>
              <li>
                <strong>2.4.7 Focus Visible</strong>{" "}(Level AA)
                &mdash; marked-up headings obscured by other
                content
              </li>
              <li>
                <strong>4.1.2 Name, Role, Value</strong>{" "}(Level A)
                &mdash; broken WAI-ARIA heading-level attributes
                (a follow-on test)
              </li>
            </ul>

            <h3>The prompt</h3>
            <pre>
              <code>{HEADINGS_PROMPT}</code>
            </pre>

            <h3>Claude&rsquo;s response</h3>
            <pre>
              <code>{HEADINGS_RESPONSE}</code>
            </pre>

            <h3>Discussion</h3>
            <p>
              This example mixes image recognition with source-code
              parsing. The goal is to find all of the likely
              headings on the page &mdash; irrespective of whether
              they have <code>&lt;hx&gt;</code>{" "}tags or{" "}
              <code>aria-level</code>{" "}attributes &mdash; check
              whether the heading order makes sense, and
              indirectly catch content that is obscured.
            </p>
            <p>
              The page is inspected at the rendered-content level
              for clues as to what the headings may be, based on
              text size, font, prominence, colour, and position;
              the HTML markup is inspected for explicit heading
              levels. The two sets of findings are then compared.
            </p>
            <p>
              The prompt is designed to report in JSON so that the
              result can be used programmatically to create a
              report, and to potentially &ldquo;fix&rdquo; the
              page via an overlay-style annotation.
            </p>
            <p>
              The output finds not just the likely headings but
              the likely hierarchy based on position and styling
              on the page; levels 1, 2, and 3 are all
              identified. In comparison, there are only three
              headings discovered in the HTML and they appear to
              be out of order (level 2, then 1, then 3).
            </p>
            <p>
              The prompt also matches the headings, and the JSON
              shows that two of the HTML headings match those
              discovered from the screenshot, with one varying in
              capitalisation (which means CSS is being used to
              capitalise the text). The third HTML heading is
              unmatched (&ldquo;Send us a message&rdquo;) because
              it is hidden by the floating cookie notice at the
              bottom of the page. That indicates we would need to
              test the focus order of the page to ensure keyboard
              focus cannot be lost under that notice &mdash; a
              possible issue for SC 2.4.7 Focus Visible. All of
              the unmatched headings found in the screenshot fail
              WCAG 1.3.1 Info and Relationships.
            </p>
            <p>
              <strong>An open question about prompt scope.</strong>{" "}
              How much of this work should actually be in the
              prompt at all? Coding and testing of page HTML is
              effectively &ldquo;free&rdquo; in that we can run
              the test multiple times at no further cost than
              writing it. Prompts, on the other hand, are costly:
              there is a per-token charge for input and output on
              every run, and AI prompts are slower than algorithms
              running locally on a desktop. The parts of the
              prompt that work on the screenshot are the parts
              that should be in the prompt; the rest is just a
              programming exercise &mdash; perhaps a complex one,
              but entirely possible.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
            aria-labelledby="demo-positioning-heading"
          >
            <h2 id="demo-positioning-heading">
              Demo 3: Positioning of cookie notices and language
              switchers
            </h2>

            <h3>What this test attempts to detect</h3>
            <p>
              Cookie notices and language switchers are
              accessibility-critical content because of{" "}
              <em>when</em>{" "}they need to be reached, not because
              of what they contain. The user must be aware of a
              cookie notice <em>before</em>{" "}they interact with
              anything that sets cookies; a user who arrives on a
              page in a language they don&rsquo;t read must be
              able to find the language switcher without
              navigating the page in the wrong language first.
              This demo identifies whether those two elements
              exist, how many tab presses it takes to reach
              each, and whether a screen-magnifier user at 400%
              magnification would be aware of them without
              vertical scrolling.
            </p>

            <h3>WCAG criteria</h3>
            <ul>
              <li>
                <strong>5.2.4 Accessibility-supported</strong>{" "}
                (conformance) &mdash; the site must support the
                assistive technologies WCAG names; failing to do
                so fails conformance
              </li>
              <li>
                <strong>4.1.2 Name, Role, Value</strong>{" "}(Level A)
                &mdash; syntax and role issues found in passing
              </li>
            </ul>

            <h3>The prompt</h3>
            <pre>
              <code>{POSITIONING_PROMPT}</code>
            </pre>

            <h3>Claude&rsquo;s response (second of three sets)</h3>
            <p className="muted">
              <small>
                Three response sets were captured at different
                temperature / token-count settings. The second
                set is reproduced below as the most detailed; the
                upstream repository carries all three.
              </small>
            </p>
            <pre>
              <code>{POSITIONING_RESPONSE}</code>
            </pre>

            <h3>Discussion</h3>
            <p>
              The demo looks at accessibility issues related to
              positioning of content. The issues sit in section
              5.2.4 of WCAG &mdash;{" "}
              <em>accessibility-supported</em>, dealing with
              conformance claims. 5.2.4 in a nutshell says that
              even if all the WCAG Success Criteria have been
              met, a website does not conform to WCAG if it does
              not support regular assistive technology. That is
              usually taken to mean screen readers and screen
              magnifiers as a bare minimum. If important or
              legally necessary content is not easily findable
              because of design decisions that impact assistive
              technology, a site has failed conformance &mdash;
              and by inference, legislation that mandates it.
            </p>
            <p>
              The prompt provides the source code of the
              InaccessibilityMatters page and a screenshot of the
              rendered page, asking first for detection of the
              two elements. For those found, it asks how many
              tab presses it takes from the top of the page to
              reach them &mdash; an accessibility issue because
              the user shouldn&rsquo;t interact with content that
              modifies cookies before being aware that the site
              uses them.
            </p>
            <p>
              Claude finds that the page contains both a cookie
              notice and a language switcher. The cookie notice
              is at the bottom of the page, and is not considered
              visible at 400% magnification with the magnifier at
              the top of the page. The claim is from Claude, and
              further investigation is needed to know what tests
              Claude used to arrive at it.
            </p>
            <p>
              Three response sets are captured, with Claude at
              different token-budget and temperature settings.
              They give similar results; the second (more tokens,
              more creativity) provides a more detailed response.
              The third set has Claude access only the source
              code without the screenshot. Claude itself notes
              the limit: <em>&ldquo;Based on the provided styles,
              the cookie notice has a fixed position at the
              bottom of the page with a white background colour
              and small font size. However, without seeing the
              rendered page, it&rsquo;s difficult to determine if
              a screen-magnifier user at 400% or greater
              magnification would be aware of it without
              scrolling.&rdquo;</em>{" "}
              That answer is the right kind of honest. The
              screenshot is doing real work for parts of this
              test that the source alone cannot answer.
            </p>
            <p>
              Looking at the second response, Claude identifies
              the explicit tab order on the page followed by the
              user tabbing to the cookie notice, naming the
              interactive elements as it goes; it requires eight
              tabs to reach the accept button. Claude also
              identifies that the language switcher is{" "}
              <code>aria-hidden</code>{" "}and has a misspelled{" "}
              <code>rol="presentation"</code>{" "}attribute (which
              should be <code>role="presentation"</code>); correctly
              identifies the language switcher as 
              keyboard-unreachable; and surfaces both conformance issues
              under WCAG 5.2.4 and syntax issues under WCAG
              4.1.2.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
            aria-labelledby="demo-interactivity-heading"
          >
            <h2 id="demo-interactivity-heading">
              Demo 4: Tab-order vs reading-order divergence and
              missing aria-expanded
            </h2>

            <h3>What this test attempts to detect</h3>
            <p>
              Two interactive-content failure modes: content
              that&rsquo;s present in the HTML reading order but
              unreachable via the tab order; and disclosure
              widgets (drop-down menus, expandable panels) that
              fail to declare their state via{" "}
              <code>aria-expanded</code>.
            </p>

            <h3>WCAG criteria</h3>
            <ul>
              <li>
                <strong>1.3.1 Info and Relationships</strong>{" "}
                (Level A)
              </li>
              <li>
                <strong>2.4.3 Focus Order</strong>{" "}(Level A)
              </li>
              <li>
                <strong>4.1.2 Name, Role, Value</strong>{" "}(Level A)
              </li>
            </ul>

            <h3>The prompt</h3>
            <pre>
              <code>{INTERACTIVITY_PROMPT}</code>
            </pre>

            <h3>Claude&rsquo;s response</h3>
            <pre>
              <code>{INTERACTIVITY_RESPONSE}</code>
            </pre>

            <h3>Discussion</h3>
            <p>
              The demo takes aim at accessibility issues in
              interactive content. It looks for unreachable
              content by comparing reading order with tab order,
              and explicitly looks for use of{" "}
              <code>aria-hidden</code>{" "}on interactive elements.
              It also looks for drop-down menus and disclosure
              widgets to see if they at least use{" "}
              <code>aria-expanded</code>{" "}(the test is not
              currently strong enough to know whether it is used{" "}
              <em>correctly</em>).
            </p>
            <p>
              The prompt provided the source code of
              InaccessibilityMatters and a screenshot of the
              rendered page (to potentially help with reading
              order and visibility). The prompt requests a reply
              in JSON, but not as precisely as it should for tab
              order &mdash; visible in the response, which does
              not properly separate out related information for
              programmatic use.
            </p>
            <p>
              What Claude does find is that there is unreachable
              content in the reading order.{" "}
              <code>pointer-events: none</code>{" "}is reported as
              the reason &mdash; I&rsquo;m not sold on that
              argument; I expected it to report on the{" "}
              <code>aria-hidden</code>{" "}attribute. So: right
              answer but wrong reason, I think. That said, the
              response does also recognise the elements as{" "}
              <code>aria-hidden</code>.
            </p>
            <p>
              Claude finds one drop-down menu (the hamburger
              menu) and correctly detects that{" "}
              <code>aria-expanded</code>{" "}is missing.
            </p>
            <p>
              The same prompt run without the screenshot
              received the same response. It would be interesting
              to see whether larger, more complex pages would
              benefit from the screenshot being provided, or
              whether this is a case of AI simply creating and
              running algorithms that could be hand-coded.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
            aria-labelledby="demo-dialog-heading"
          >
            <h2 id="demo-dialog-heading">
              Demo 5: Modal dialogs &mdash; detection, focus
              management, escape, inert background
            </h2>

            <p
              role="note"
              className="muted"
              style={{ "--space": "var(--s-1)" } as CSSProperties}
            >
              <strong>This is the most fragile of the five.</strong>{" "}
              The detection of modal dialogs relies heavily on
              Claude inferring intent from the page, and the
              follow-on tests for focus management, escape
              handling, and background inertness depend on that
              detection being right in the first place. The
              upstream README flags this prominently; this page
              does the same.
            </p>

            <h3>What this test attempts to detect</h3>
            <p>
              Modal dialogs and the click handlers that open
              them. For each found, the test asks: does focus
              move to the modal when it opens? Does focus return
              to the opening button when the modal closes? Does
              the modal start with an <code>&lt;h1&gt;</code>{" "}or{" "}
              <code>&lt;h2&gt;</code>{" "}heading? Does it have a{" "}
              <code>role</code>{" "}of <code>dialog</code>{" "}or{" "}
              <code>alertdialog</code>, or use the native{" "}
              <code>&lt;dialog&gt;</code>{" "}element? Is there a
              close button? Does Escape close the dialog? Is the
              background actually inert?
            </p>
            <p>
              None of the issues found by this demo are currently
              available in commercial automated test tools.
            </p>

            <h3>WCAG criteria</h3>
            <ul>
              <li>
                <strong>2.1.1 Keyboard</strong>{" "}(Level A) &mdash;
                Escape-to-close
              </li>
              <li>
                <strong>2.4.3 Focus Order</strong>{" "}(Level A)
                &mdash; focus management on open and close
              </li>
              <li>
                <strong>4.1.2 Name, Role, Value</strong>{" "}(Level A)
                &mdash; <code>role="dialog"</code> /{" "}
                <code>alertdialog</code>
              </li>
              <li>
                <strong>1.3.1 Info and Relationships</strong>{" "}
                (Level A) &mdash; modal heading
              </li>
            </ul>

            <h3>The prompt</h3>
            <pre>
              <code>{DIALOG_PROMPT}</code>
            </pre>

            <h3>Claude&rsquo;s response</h3>
            <pre>
              <code>{DIALOG_RESPONSE}</code>
            </pre>

            <h3>Discussion</h3>
            <p>
              The demo searches for buttons and click handlers
              that look like they may open modal dialogs. For
              each one found it tests how the dialog is opened
              and closed, the role given, whether the modal is
              truly modal (the background behind it is inert), and
              whether the dialog has a heading. The tests are
              based on the current state of the page, which
              we get from the pasted dev-tools page content. The
              results are requested in JSON form, partly for
              readability and partly to allow programmatic
              inspection.
            </p>
            <p>
              Claude finds two potential modals. One is a real
              modal on the page; the other is a JavaScript{" "}
              <code>alert()</code>{" "}call, which is also a modal.
              The test did not handle the <code>alert()</code>{" "}
              case correctly &mdash; the modal is identified but
              the modal properties are not properly inspected.
            </p>
            <p>
              Looking at the &ldquo;real&rdquo; modal, a full set
              of tests are reported. Claude correctly reports
              that focus is not moved to the modal when it opens
              (the test checks for the <code>focus()</code>{" "}
              method), but that focus does correctly return to
              the opening element (a button) when the modal is
              closed from its close button.
            </p>
            <p>
              Claude also detects that the modal has an{" "}
              <code>&lt;h2&gt;</code>{" "}heading and a close button;
              identifies that the <code>role</code>{" "}has not been
              set to <code>dialog</code>; finds no Escape-based
              close handler; and reports that the background to
              the modal is not inert.
            </p>
            <p>
              <strong>
                The risk with this prompt is that too much trust
                is being placed in Claude without validating the
                response.
              </strong>{" "}
              Claude&rsquo;s response on this test page is near
              perfect &mdash; but I wonder how well it would do
              on content out in the wild. The detection step is
              where most of the inference happens, and detection
              failures will silently invalidate every downstream
              test. This is the demo most in need of structured
              validation against a larger, more varied corpus
              before being relied on.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where this work points</h2>
            <p>
              The five demos taken together are an honest map of
              where AI-driven accessibility testing currently sits
              relative to commercial tools. Some categories of
              issue &mdash; language detection, heading inference,
              positioning-and-magnifier reasoning &mdash; the
              AI handles cleanly and produces auditable output.
              Others &mdash; modal dialog detection, the meaning
              of obscure attribute combinations &mdash; the AI
              attempts but cannot yet be trusted without
              structural validation.
            </p>
            <p>
              The 2029 framework is the theoretical end of the
              research line whose practical present-day end these
              PoCs probe. The PoCs identify where AI can add
              value beyond commercial tools today; the 2029 work
              would build out the formal multi-agent structure
              that makes this kind of testing systematic rather
              than ad-hoc.
            </p>
            <p>
              The captured demos here are the substance the page
              exists for. A bring-your-own-key panel that lets
              visitors re-run a demo against a different URL with
              their own Anthropic API key is on the roadmap; the
              honest demonstrations come first.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

/* The prompts are reproduced verbatim from the upstream repo
 * (github.com/bobdodd/automated-testing) with only the embedded
 * InaccessibilityMatters HTML body trimmed out for length —
 * the on-site demo shows the prompt instruction; the full
 * including-HTML version lives in the repository. */

const LANGUAGE_PROMPT = `Based on the textContent of each element, what is the dominant language of the following HTML? Does this match the language defined for the page in the HTML? Are there any words not in the dominant language? If so, do they have the required lang attribute applied?`;

const LANGUAGE_RESPONSE = `Based on the textContent of the elements, the dominant language of the HTML page appears to be English.
However, this does not match the language defined for the page in the HTML tag, which is set to "fr" (French).

There are a few words and phrases that are not in English:

1. "Español" in the language switcher
2. "Français" in the language switcher

These non-English words do not have the required \`lang\` attribute applied to them.
To properly indicate the language of these words, you should wrap them in an appropriate element
(e.g., \`<span>\`) and add the \`lang\` attribute with the corresponding language code. For example:

\`\`\`html
<a href="#"><span lang="es">Español</span></a>
<a href="#"><span lang="fr">Français</span></a>
\`\`\`

By adding the \`lang\` attribute, you provide a clear indication of the language used
for those specific words, which is important for accessibility and proper language identification.`;

const HEADINGS_PROMPT = `The image is a web screenshot. The following content is the HTML source code for the image. Using only the image, identify each probable heading in the image and the hierarchy based on font name, size, weight, color and prominence of text, even if the heading is quite short or a misplaced link. Do however exclude those that appear to be items in menus, menu bars, pop-up menus, and tab headings (a tab heading may look like a coloured rectangle containing the text in a list of other text, or it may look like text with an icon with some space around it above or to one side of it). Using only the HTML, identify all of the headings declared in the HTML as <hx> headings or role of heading (excluding any that appear to be on non-visible modal dialogs) and their text. Match the text of the image headings with the headings in the HTML. Identify headings in the HTML not visible in the image. For HTML headings that are not matched, inspect the headings to identify if the HTML heading is deliberately visually hidden, or more likely obscured by other content. Identify headings in the image that are not marked up in the HTML. Report all of the identified content as a single JSON object. Name the array of image headings 'imageHeadings'. Name the array of HTML headings 'htmlHeadings'. Name the array of matched headings 'matchedHeadings'. If the matched headings differ in some way e.g. in capitalization then note this. Name the array of unmatched HTML headings 'unmatchedHtmlHeadings'. Name the array of obscured HTML headings 'obscuredHtmlHeadings'. Name the array of unmatched image headings 'unmatchedImageHeadings'. For each unmatched image heading provide an object with attributes 'text' and 'level' to describe the properties; in this case also identify the XPath to the equivalent element in the HTML where text was used. I do not require any other output other than the JSON. Respond ONLY with the stringified JSON and no other text.`;

const HEADINGS_RESPONSE = `{
    "imageHeadings": [
        { "text": "WELCOME TO INACCESSIBILITY MATTERS", "level": 1 },
        { "text": "Click to open popup", "level": 2 },
        { "text": "Learn more", "level": 2 },
        { "text": "to learn more about us", "level": 2 },
        { "text": "Explore our accessibility resources", "level": 2 },
        { "text": "Get in touch with our accessibility experts", "level": 2 },
        { "text": "Subscribe to Our Newsletter", "level": 3 },
        { "text": "Contact Us", "level": 2 }
    ],
    "htmlHeadings": [
        { "text": "Send us a message", "level": 2 },
        { "text": "Welcome to Inaccessibility Matters", "level": 1 },
        { "text": "Subscribe to Our Newsletter", "level": 3 }
    ],
    "matchedHeadings": [
        {
            "imageText": "WELCOME TO INACCESSIBILITY MATTERS",
            "htmlText": "Welcome to Inaccessibility Matters",
            "note": "Text differs in capitalization"
        },
        {
            "imageText": "Subscribe to Our Newsletter",
            "htmlText": "Subscribe to Our Newsletter"
        }
    ],
    "unmatchedHtmlHeadings": [
        { "text": "Send us a message", "level": 2 }
    ],
    "obscuredHtmlHeadings": [],
    "unmatchedImageHeadings": [
        { "text": "Click to open popup", "level": 2, "xpath": "/html/body/div[3]" },
        { "text": "Learn more", "level": 2, "xpath": "/html/body/a[1]" },
        { "text": "to learn more about us", "level": 2, "xpath": "/html/body/a[1]" },
        { "text": "Explore our accessibility resources", "level": 2, "xpath": "/html/body/a[2]" },
        { "text": "Get in touch with our accessibility experts", "level": 2, "xpath": "/html/body/a[3]" },
        { "text": "Contact Us", "level": 2, "xpath": "/html/body/footer/button" }
    ]
}`;

const POSITIONING_PROMPT = `Using the source code below and the screenshot of that rendered page, identify whether there is a cookie notice and/or a language switcher. How many times must the user tab from the beginning of the page to reach each of those elements (assuming that it is possible at all)? Where in the viewport are those elements and would a screen-magnifier user on 400% or greater magnification be aware of them without scrolling down the page (assuming the magnifier is currently top-left)?`;

const POSITIONING_RESPONSE = `Number of tokens: 4000
Temperature: 1

Based on the updated instructions and the provided source code and screenshot, here are my findings:

1. Cookie Notice:
   - There is a cookie notice present at the bottom of the page.
   - The cookie notice is not visible in the provided screenshot without scrolling down, so a screen-magnifier user at 400% or greater magnification would not be aware of it without scrolling.
   - To reach the cookie notice from the beginning of the page using the tab key, the user would need to tab through the following elements in order: skip link, hamburger menu button, "Click to open popup" button, "Contact Us" button, email input field, subscribe button, and finally the "Accept" button in the cookie notice. This requires a total of 7 tab presses.

2. Language Switcher:
   - There is a language switcher present on the page, located in the top-right corner.
   - However, the language switcher is marked as \`aria-hidden="true"\`, which means it is hidden from assistive technologies and not accessible via keyboard navigation.
   - The language switcher links also have \`rol="presentation"\` (which should be \`role="presentation"\`) and \`pointer-events: none;\`, further indicating that they are not interactive or accessible.
   - Since the language switcher is not accessible, it cannot be reached by tabbing from the beginning of the page.

To summarize, the cookie notice is present but requires scrolling and 7 tab presses to reach from the beginning of the page, while the language switcher is present but inaccessible to keyboard and assistive technology users.`;

const INTERACTIVITY_PROMPT = `The image is a web screenshot. The following content is the HTML source code for the image. For currently visible content, does the page tab order match the HTML reading order? If not then where does it diverge and what is the XPath at the point of divergence? Identify any interactive element on the page that is not keyboard accessible and give the XPath and reason. Are there any interactive elements on the page where aria-hidden has been applied? If so please give the XPath of the interactive elements affected. Looking at both the screenshot and HTML, identify any apparent pop-up/drop down menus or disclosure widgets (at any responsive breakpoint) that does not utilize aria-expanded, but exclude buttons that open modal dialogs. Give all answers in a single JSON object. I do not require any other output other than the JSON.`;

const INTERACTIVITY_RESPONSE = `{
  "tabOrder": "The tab order does not match the HTML reading order. It diverges at the language switcher links, which are not keyboard accessible due to the 'pointer-events: none' style. The XPath at the point of divergence is /html/body/div[2].",
  "nonAccessibleInteractiveElements": [
    { "xpath": "/html/body/div[2]/a[1]", "reason": "Pointer events disabled" },
    { "xpath": "/html/body/div[2]/a[2]", "reason": "Pointer events disabled" },
    { "xpath": "/html/body/div[2]/a[3]", "reason": "Pointer events disabled" }
  ],
  "ariaHiddenInteractiveElements": [
    "/html/body/div[2]/a[1]",
    "/html/body/div[2]/a[2]",
    "/html/body/div[2]/a[3]"
  ],
  "missingAriaExpanded": [
    "/html/body/header/nav/nav/div"
  ]
}`;

const DIALOG_PROMPT = `The image is a web screenshot. The following content is the HTML source code for the image. For currently visible content, identify any interactive element, or non-interactive element with click handler that appears to open a modal dialog with the XPath of the button and the XPath of the modal dialog were it to open. For each click handler found that opens a modal, does focus move to the modal dialog when the modal dialog opens or does it remain on the button? (test for this by checking for the javaScript focus() method). Does focus return to the button when the dialog closes? Does the modal dialog start with a heading, and is it either an <h1> or <h2> and if so, which one? Does the modal dialog have a role of dialog or alertdialog or use the <dialog> element? Does the modal dialog have a close button? Does the modal dialog close if escape is pressed? Is the modal dialog truly modal, is the rest of the page inert? Give all answers in a single JSON object. I do not require any other output other than the JSON.`;

const DIALOG_RESPONSE = `{
  "clickHandlers": [
    {
      "button": "//*[@id='absolutePoistion']",
      "modal": null,
      "focusMovesToModal": false,
      "focusReturnsToButton": false,
      "modalHeading": null,
      "modalHeadingLevel": null,
      "modalRole": false,
      "modalCloseButton": false,
      "modalClosesOnEscape": false,
      "trulyModal": false
    },
    {
      "button": "//*[@id='openModal']",
      "modal": "//*[@id='modal']",
      "focusMovesToModal": false,
      "focusReturnsToButton": true,
      "modalHeading": true,
      "modalHeadingLevel": "h2",
      "modalRole": false,
      "modalCloseButton": true,
      "modalClosesOnEscape": false,
      "trulyModal": false
    }
  ]
}`;
