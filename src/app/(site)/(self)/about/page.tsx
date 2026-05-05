import type { CSSProperties } from "react";

export default function About() {
  return (
    <main id="main" className="site-main" data-zone="self">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <h1>About</h1>
          <p style={{ fontSize: "var(--s1)" }}>
            <em>
              It was always about systems that respond intelligently to
              context. The model railway just had fewer modalities.
            </em>
          </p>

          <section>
            <h2>The arc, in artefacts</h2>
            <p>
              Childhood ICL 2900s, ZX Spectrum, mainframe time at school.
              Metal Box and the Cadbury Cream Egg production line. Siemens
              Plessey, Ascom, Nokia — twenty-something years of systems-
              thinking work before accessibility found me, or I found it.
            </p>
            <p>
              Doctoral research at Teesside, 2004–2013. The W4A 2010 paper
              describing the Carnforth Model is from this period. CELA and
              CNIB followed.
            </p>
          </section>

          <section>
            <h2>Now</h2>
            <p>
              Leading accessibility at CNIB Access Labs in Toronto. Reading
              widely, writing slowly, building Paradise. Available for
              select advisory work alongside the CNIB role; broader
              independent practice opens in 2029.
            </p>
          </section>

          <p>
            <small>
              This page is a placeholder. The full arc lives in the working
              draft.
            </small>
          </p>
        </div>
      </div>
    </main>
  );
}
