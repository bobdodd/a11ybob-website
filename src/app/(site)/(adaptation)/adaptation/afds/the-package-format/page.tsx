import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "The package format",
};

export default function ThePackageFormat() {
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
            <h1>The package format</h1>
            <p className="lede">
              [Lede to come. A design system that cannot be carried from
              one toolchain to another is not portable. Version 1.0.0
              defines a single file that can be.]
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>One file, a ZIP with an .afds extension</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The manifest</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The inventory and its digests</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the package holds</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why not OPC</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Versioning</h2>
            <p>[To come.]</p>
          </section>
        </div>
      </div>
    </main>
  );
}
