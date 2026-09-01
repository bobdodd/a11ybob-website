import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";
import { SpecNav } from "@/components/SpecNav";
import { getSpecContents } from "@/lib/specification";

const BASE = "/adaptation/afds/specification";

export const metadata: Metadata = {
  title: "AFDS specification, version 1.0.0",
};

export default async function Specification() {
  const contents = await getSpecContents();
  const navPages = contents.pages.map((p) => ({
    href: `${BASE}/${p.slug}`,
    label: p.label,
  }));

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
            <h1>AFDS specification, version 1.0.0</h1>
            <p className="lede">
              This document specifies an Accessibility Focused Design
              System: what such a system contains, what each part of it
              means, what a component is obliged to declare about
              itself, how the evidence behind those declarations is
              recorded, and how the whole is serialised as a portable
              package that another organisation can read.
            </p>
            <p>
              An AFDS exists so that an accessibility decision, its
              reasoning, and the evidence for it can be made once and
              then travel, instead of being rediscovered on every
              screen that needs it.
            </p>
          </header>

          <SpecNav pages={navPages} />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>How to read this</h2>
            <p>
              The document is one specification in four parts. Clause
              numbers are global and permanent within a version. Clause
              23 is clause 23 wherever it is rendered, so a citation
              never has to name a part or a page, and the split into
              pages below carries no meaning. Each clause on these
              pages has a stable anchor derived from its number, so{" "}
              <code>#c23-2</code> is clause 23.2 and will stay so.
            </p>
            <p>
              AFDS 1.0.0 is a project draft. It is not a W3C standard,
              not a published industry specification, and not on any
              standards track. The{" "}
              <Link href={`${BASE}/status`}>status of this document</Link>{" "}
              says what is normative, what is informative, and what
              that draft standing means.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Contents</h2>

            {contents.pages.map((page) => (
              <section
                key={page.slug}
                className="stack"
                style={{ "--space": "var(--s-1)" } as CSSProperties}
              >
                <h3>
                  <Link href={`${BASE}/${page.slug}`}>{page.heading}</Link>
                </h3>
                {page.clauses.length > 0 && (
                  <ul>
                    {page.clauses.map((clause) => (
                      <li key={clause.number}>
                        <Link
                          href={`${BASE}/${page.slug}#${clause.anchor}`}
                        >
                          {clause.number}. {clause.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
