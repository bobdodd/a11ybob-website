import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "Portable representations",
};

export default function PortableRepresentations() {
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
            <h1>Portable representations</h1>
            <p className="lede">
              [Lede to come. Before deciding how to carry a design
              system from one place to another, it is worth asking what
              the industry has already tried, and what none of it can
              yet say.]
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Portability is not one problem</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What already exists, and how mature it is</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Design tokens, and what they cannot say</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Manifests and stories</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why a bundle, and not a new standard</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What was rejected, and why</h2>
            <p>[To come.]</p>
          </section>
        </div>
      </div>
    </main>
  );
}
