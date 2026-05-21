import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function MeasureOfAccessibilityIndex() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ResearchSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>The Measure of Accessibility</h1>
            <p className="lede">
              A six-page treatment of what accessibility is, how to
              measure it, and why the answer matters. The political
              framing of the question; the formal distinction
              between functional and intrinsic accessibility; the
              rejection of utilitarianism; the methodological
              substrate that lets the formal definitions be built
              rather than just stated; and the 
              communities-of-practice framing that opens onto the{" "}
              <Link href="/research/2029-framework">
                2029 framework
              </Link>
              .
            </p>
            <blockquote>
              <p>
                <em>
                  Accessibility is the outcome of the encounter
                  between an entity&rsquo;s capacity to interact and
                  its users&rsquo; physical and cognitive
                  capabilities, with capacity, capability, and
                  accessibility all expressed as measurable and
                  quantitative properties.
                </em>
              </p>
            </blockquote>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The six pages</h2>
            <ol>
              <li>
                <Link href="/research/the-measure-of-accessibility/the-question">
                  <strong>The Question</strong>
                </Link>{" "}
                — the political framing.{" "}
                <em>
                  &ldquo;What is accessibility and how do you measure
                  it? The answer is wholly political.&rdquo;
                </em>{" "}
                The hammer-and-nail line. The spectrum from
                insertion-into-existing-society to 
                universal-access-by-design. Why current vocabularies (legal, ergonomic,
                usability) underdetermine the answer.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility/functional-accessibility">
                  <strong>Functional Accessibility</strong>
                </Link>{" "}
                — the formal definition with notation. The negotiation
                framing between user and provider. Multi-medium
                robustness. Legal-rights scoping and its limits.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                  <strong>Intrinsic Accessibility</strong>
                </Link>{" "}
                — the contrast with functional. The pseudo-user
                formalism. The proof of an optimal pseudo-user set
                independent of provider. Why intrinsic generalises
                where functional doesn&rsquo;t.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility/equivalent-experience">
                  <strong>Equivalent Experience</strong>
                </Link>{" "}
                — the timing dimension; the equality argument; the
                rejection of utilitarianism.{" "}
                <em>
                  &ldquo;We are all equal members of society with the
                  same right to access goods and services.&rdquo;
                </em>{" "}
                Why &ldquo;the greatest good of the greatest
                number&rdquo; is the wrong frame.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                  <strong>The Shlaer-Mellor lens</strong>
                </Link>{" "}
                — recursive design as accessibility. Bridged semantic
                domains, model compilation, the four-decade
                engineering lineage. The methodological substrate
                that makes formal definitions buildable rather than
                just stated.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility/communities-of-practice">
                  <strong>Communities of Practice</strong>
                </Link>{" "}
                — UI as community of practice; user populations as
                community of practice with memetic profile evolution.
                Inaccessibility as community dysfunction. The opening
                into multi-agent / 2029 territory.
              </li>
            </ol>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>How to read it</h2>
            <p>
              The collection forms a coherent linear read for
              someone who wants the whole position. Each page also
              stands alone — the cross-links inside each page point
              at the others where the dependency matters. The
              shortest legitimate route through the position is{" "}
              <em>The Question</em> &rarr; <em>Functional</em>{" "}
              &rarr; <em>Intrinsic</em>; the substantive depth-stop
              is the full six.
            </p>
            <p className="muted">
              <small>
                Pages are landing in stages; substantive prose drafts
                are in progress.
              </small>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
