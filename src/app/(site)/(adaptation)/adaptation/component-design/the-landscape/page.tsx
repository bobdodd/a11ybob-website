import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ComponentDesignSubNav } from "@/components/ComponentDesignSubNav";

export const metadata: Metadata = {
  title: "The framework landscape",
};

export default function TheLandscape() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ComponentDesignSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>The framework landscape</h1>
            <p className="lede">
              A survey of component frameworks is not the interesting
              part of this work, and I have kept it short. It is here
              because the architectural split it reveals matters to the
              argument, and because what these systems have in common is
              also what they all leave out.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The three layers</h2>
            <p>
              Most component frameworks are structured the same way, in
              three layers. Design tokens hold the atomic style values:
              colour, spacing, type scale, radii, motion durations.
              A component library consumes those tokens and exposes a
              constrained set of variants. Guidelines say when and how
              each component should be used.
            </p>
            <p>
              The token layer has been converging on a shared format.
              The W3C Design Tokens Community Group specification reached
              its first stable version in October 2025, which means the
              bottom layer of this stack is now interchangeable between
              tools in a way the two layers above it are not.
            </p>
            <p>
              That asymmetry is worth noticing early. The part of a
              design system that is easiest to standardise is the part
              that carries the least accessibility information. A
              spacing value can be exchanged between six tools. Whether
              a component owns focus cannot be exchanged between any of
              them.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Styled and headless</h2>
            <p>
              The split that matters most for this argument is between
              libraries that ship behaviour and appearance together and
              libraries that ship behaviour alone.
            </p>
            <p>
              On the styled side: Material from Google, Fluent from
              Microsoft, Spectrum from Adobe, Lightning from Salesforce,
              Carbon from IBM, Polaris from Shopify, Atlaskit from
              Atlassian, Fiori from SAP, and the independent systems
              Ant Design, Chakra, Mantine, PatternFly and Bootstrap. You
              take the interaction semantics and the visual design as
              one unit.
            </p>
            <p>
              On the headless side: React Aria from Adobe, Radix UI,
              Headless UI and Ariakit. Focus management, keyboard
              grammar, roles and states ship without styling, and the
              presentation is yours to supply.
            </p>
            <p>
              The headless model is the closer analogue to what I am
              building, because it separates the part that can be
              guaranteed from the part that must be selected per
              instance. Interaction semantics can be promised. A
              particular rendering cannot, because which rendering is
              right depends on the capability and preference model of
              the person in front of it.
            </p>
            <p>
              This is the same philosophy as Bryan Garaventa&rsquo;s
              AccDC and its claim of automatically accessible
              technologies: accessibility as a byproduct of the
              framework rather than the finding of a later audit. My
              review of{" "}
              <Link href="/writing/reviews/69c2a32f4611a589f2ce95f7">
                The AccDC Enterprise API for Advanced UI Automation
              </Link>{" "}
              goes through the claim in detail, and the ambition is the
              right one. The limit is the subject of this section: a
              framework can make a component correct by construction
              and still leave every assembly question open.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Standards-first and public-sector systems</h2>
            <p>
              A second group is built to a published accessibility
              baseline rather than to a brand.
            </p>
            <ul>
              <li>
                The{" "}
                <a href="https://design-system.service.gov.uk/accessibility/">
                  GOV.UK Design System
                </a>
                , with a WCAG AA baseline, progressive enhancement, a
                published accessibility strategy and a published
                practice of accessibility acceptance criteria.
              </li>
              <li>
                USWDS in the United States, Designsystemet in Norway,
                DKFDS in Denmark, the NL Design System in the
                Netherlands, and Canada.ca.
              </li>
              <li>
                KoliBri from ITZBund in Germany, a framework-agnostic
                WCAG and BITV reference implementation.
              </li>
              <li>
                Lion from ING, white-label accessible web components
                designed from the outset to be restyled.
              </li>
              <li>
                The{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/">
                  ARIA Authoring Practices Guide
                </a>
                , which is not a library at all but is the behavioural
                specification most libraries are implementing.
              </li>
            </ul>
            <p>
              The NL Design System is the most interesting governance
              model here. It is an architecture that individual agencies
              build their own component libraries against, rather than a
              single shared library everybody consumes. That is
              structurally much closer to a portable design system
              bundle than a conventional vendor system is, and it is
              evidence that the portable-architecture approach is
              workable at the scale of a government.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the survey does not tell us</h2>
            <p>
              Every system named above documents its components in
              isolation, and documents them well. Almost none of them
              publishes a machine-readable statement of what may contain
              what, who owns focus when two components are nested, or
              which guarantees are invalidated by an override.
            </p>
            <p>
              I want to be fair about this. The information is sometimes
              present in prose, scattered through guidance pages, and a
              careful reader of a particular system can often work out
              the answer. What is missing is the statement in a form
              that survives being carried to another team, and in a form
              a validator could check. Guidance that lives in a sentence
              on a usage page cannot be enforced at assembly time, and
              it does not travel with the component.
            </p>
            <p>
              That absence is what the rest of this section is about.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                Garaventa, B.{" "}
                <em>
                  The AccDC Enterprise API for Advanced UI Automation
                </em>
                . WhatSock.com, 2011.{" "}
                <Link href="/writing/reviews/69c2a32f4611a589f2ce95f7">
                  Review of the AccDC Enterprise API
                </Link>
              </li>
              <li>
                Design Tokens Community Group.{" "}
                <em>Design Tokens Format Module</em>.{" "}
                <a href="https://www.designtokens.org/tr/2025.10/format/">tr/2025.10/format</a>
              </li>
              <li>
                Government Digital Service.{" "}
                <em>GOV.UK Design System: accessibility</em>.{" "}
                <a href="https://design-system.service.gov.uk/accessibility/">design-system/accessibility</a>
              </li>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>ARIA Authoring Practices Guide</em>.{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/">ARIA/apg</a>
              </li>
              <li>
                Open UI Community Group.{" "}
                <em>Design systems research</em>.{" "}
                <a href="https://open-ui.org/">open-ui.org</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
