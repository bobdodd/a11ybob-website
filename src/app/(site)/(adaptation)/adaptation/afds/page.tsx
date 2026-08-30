import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "Describing interfaces and modalities",
};

export default function Afds() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <AfdsSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Describing interfaces and modalities</h1>
            <p className="lede">
              [Lede to come. A capability model and a preference model,
              together with the needs of the application, drive design
              decisions for the user interface. A design system
              describes the outcomes of those decisions. This section
              is about the accessibility-focused form of that
              artefact.]
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What an AFDS is</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why this is a design system problem</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The parts</h2>
            <ol>
              <li>
                <Link href="/adaptation/afds/why-a-design-system">
                  Why a design system
                </Link>
                : the case for the design system as the place where
                accessibility decisions are made and recorded.
              </li>
              <li>
                <Link href="/adaptation/afds/what-a-component-declares">
                  What a component declares
                </Link>
                : contracts, guarantees, and the non-guarantees a
                component must state as plainly as its promises.
              </li>
              <li>
                <Link href="/adaptation/afds/evidence-and-uncertainty">
                  Evidence and uncertainty
                </Link>
                : the assistive-technology record as structured data,
                and what is not yet known kept as a record in its own
                right.
              </li>
              <li>
                <Link href="/adaptation/afds/the-package-format">
                  The package format
                </Link>
                : one file, a manifest, and an inventory of digests, so
                a design system can be carried and checked.
              </li>
              <li>
                <Link href="/adaptation/afds/adapters">Adapters</Link>
                : how a package meets a real toolchain, and why no
                adapter is canonical.
              </li>
              <li>
                <Link href="/adaptation/afds/user-guide">User guide</Link>
                : how to read, author, package, and validate an AFDS.
              </li>
              <li>
                <Link href="/adaptation/afds/specification">
                  Specification
                </Link>
                : the normative definition, version 1.0.0.
              </li>
            </ol>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Materials</h2>
            <p>[To come.]</p>
          </section>
        </div>
      </div>
    </main>
  );
}
