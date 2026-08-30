import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "Adapters",
};

export default function Adapters() {
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
            <h1>Adapters</h1>
            <p className="lede">
              [Lede to come. A package has to meet a real toolchain to
              be worth anything, and no single toolchain gets to define
              the format.]
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>No adapter is canonical</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What an adapter does</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Adapters in version 1.0.0</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Writing a new adapter</h2>
            <p>[To come.]</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Round-tripping, and what is lost</h2>
            <p>[To come.]</p>
          </section>
        </div>
      </div>
    </main>
  );
}
