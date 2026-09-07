import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";
import { GuideNav } from "@/components/GuideNav";
import { getGuideContents } from "@/lib/user-guide";

const BASE = "/adaptation/afds/user-guide";
const SPEC = "/adaptation/afds/specification";

export const metadata: Metadata = {
  title: "AFDS user guide",
};

export default async function UserGuide() {
  const contents = await getGuideContents();
  const navPages = contents.pages.map((p) => ({
    href: `${BASE}/${p.slug}`,
    label: p.heading,
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
            <h1>AFDS user guide</h1>
            <p className="lede">
              A guide to Accessibility Focused Design Systems, for the
              designers, developers and testers who have to use one.
            </p>
            <p>
              It explains what a design system is, why this project
              treats accessibility as the reason the system exists
              rather than a feature it happens to include, and then
              works through every part of AFDS: how a package claims
              conformance, what a component declares about itself and
              refuses to promise, the records that make a claim
              checkable, the optional method profiles that carry one
              way of designing, and the <code>.afds</code> package that
              carries all of it from one organisation to another. It
              assumes no prior knowledge of design systems, design
              tokens or WCAG.
            </p>
          </header>

          <GuideNav pages={navPages} />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>How to read this</h2>
            <p>
              You do not need to read the guide in order. It is
              organised around tasks rather than around the
              specification&rsquo;s argument, so a section that draws
              on clause 7 may sit next to one that draws on clause 29.
              Each section states the problem it addresses before it
              explains the mechanism, so you can enter anywhere.
            </p>
            <p>
              The guide is informative documentation and issues no
              requirement of its own. Every statement of obligation
              carries the clause it comes from, and each of those
              citations links into the{" "}
              <Link href={SPEC}>specification</Link>, so you can always
              get from an instruction here to the normative text behind
              it. Where the guide and the specification disagree, the
              specification wins and the disagreement is a defect in
              the guide. The{" "}
              <Link href={`${BASE}/status`}>status of this guide</Link>{" "}
              says what that standing means.
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
                {page.sections.length > 0 && (
                  <ul>
                    {page.sections.map((section) => (
                      <li key={section.anchor}>
                        <Link
                          href={`${BASE}/${page.slug}#${section.anchor}`}
                        >
                          {section.title}
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
