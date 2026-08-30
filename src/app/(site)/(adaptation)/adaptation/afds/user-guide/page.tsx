import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "User guide",
};

export default function UserGuide() {
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
            <h1>User guide</h1>
            <p className="lede">
              [Lede to come. How to read an AFDS package, author one,
              record evidence in it, and validate it before it leaves
              your hands.]
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Before you start</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading a package</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Authoring a design system</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Declaring components</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Recording evidence and uncertainty</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Packaging and validating</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Using an adapter</h2>
            <p>[To come.]</p>
          </section>
        </div>
      </div>
    </main>
  );
}
