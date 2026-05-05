import Link from "next/link";
import type { CSSProperties } from "react";

/* The article roster mirrors the working drafts currently held in the
   editorial workspace. The 16 pieces span 11 distinct accessibility
   domains. Slugs match what migrate-articles.ts produces. */

const articles = [
  {
    slug: "music-and-digital-accessibility",
    title: "What Music Knows About Accessibility",
    summary:
      "Music is multimodal by default. Working in it forces designers to think about access from the inside out, and the rest of accessibility has been slow to learn what music already knows.",
  },
  {
    slug: "wcag-2-to-ai-web-accessibility-evolution",
    title:
      "From WCAG 2.0 to AI: What a Thousand Research Papers Reveal About Web Accessibility's Evolution",
    summary:
      "An analysis of nearly a thousand peer-reviewed accessibility research papers published since WCAG 2.0, examining what has worked, what has failed, and where the field is heading.",
  },
  {
    slug: "ai-in-accessibility",
    title: "AI and Accessibility: Promise, Peril, and the Path Forward",
    summary:
      "What the research actually tells us about artificial intelligence in the lives of disabled people — beyond the marketing.",
  },
  {
    slug: "ai-safety-accessibility",
    title: "AI Safety and Disability: What Accessibility Research Reveals",
    summary:
      "Where the AI-safety field and the accessibility field agree, and where they have not yet recognised they are talking about the same thing.",
  },
  {
    slug: "neurodivergence-accessibility",
    title:
      "Neurodivergence and Digital Accessibility: What Researchers Are Learning",
    summary:
      "The research on neurodivergence and digital tooling is moving from accommodation to design.",
  },
  {
    slug: "sign-language-accessibility",
    title:
      "Sign Language and Technology: Advances, Tensions, and the Quiet Revolution",
    summary:
      "Where sign-language technology is moving, and what it leaves behind.",
  },
  {
    slug: "data-visualization-accessibility",
    title:
      "Seeing Data Differently: How Accessibility Research Is Rethinking Charts",
    summary:
      "Charts assume sight. The research on alternatives is more interesting than the alt-text debate suggests.",
  },
  {
    slug: "aac-communication-accessibility",
    title:
      "Beyond Speech: What Research Reveals About Augmentative and Alternative Communication",
    summary:
      "The research on AAC, picked up where the literature stopped serving the community it was meant to serve.",
  },
  {
    slug: "autoethnography-accessibility",
    title:
      "First Person: How Autoethnography Is Changing What Accessibility Research Knows",
    summary:
      "When the researcher is the disabled person, the questions change. The methods are catching up.",
  },
  {
    slug: "navigation-wayfinding-accessibility",
    title: "Getting There: What Accessibility Research Reveals About Navigation",
    summary:
      "Outdoor and indoor wayfinding research, and what it implies for screens.",
  },
  {
    slug: "machine-learning-accessibility",
    title:
      "Machine Learning and Digital Accessibility: What Works, What Doesn't",
    summary:
      "ML in accessibility, by what the published research can actually substantiate.",
  },
  {
    slug: "multimedia-accessibility",
    title:
      "Making Multimedia Accessible: What Researchers Are Learning",
    summary:
      "Captions, audio description, transcripts, and the surfaces beyond them.",
  },
  {
    slug: "music-accessibility",
    title: "The Right to Shape Sound: How Accessibility Research Is Rethinking Music",
    summary:
      "An earlier survey of the music-and-accessibility literature, on which the long-form music essay later built.",
  },
  {
    slug: "trends-in-digital-accessibility",
    title: "Trends in Digital Accessibility Research: What Researchers Are Watching",
    summary:
      "What the published research suggests about where the field is going.",
  },
  {
    slug: "xr-accessibility",
    title: "Extended Reality and Accessibility: What 51 Research Papers Tell Us",
    summary:
      "The accessibility research on VR, AR, and XR is small but moving fast.",
  },
  {
    slug: "w4a-eras",
    title: "22 Years of Digital Accessibility Research at W4A",
    summary:
      "What 584 papers from the W4A conference series say about how the field has changed.",
  },
];

export default function WritingIndex() {
  return (
    <main id="main" className="site-main" data-zone="writing">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Writing</h1>
            <p style={{ fontSize: "var(--s1)" }}>
              Long-form synthesis of published accessibility research. Each
              piece is grounded in named papers; each claim points back to
              the underlying evidence.
            </p>
            <p>
              The archive is licensed CC BY-SA. Citation and reuse are
              welcome; please credit and link back.{" "}
              <Link href="/writing/reading">
                Browse the underlying review database (2,661 papers) →
              </Link>
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Articles</h2>
            <div
              className="grid"
              style={
                {
                  "--minimum": "20rem",
                  "--space": "var(--s1)",
                } as CSSProperties
              }
            >
              {articles.map((a) => (
                <Link key={a.slug} href={`/writing/${a.slug}`} className="door">
                  <h3 style={{ marginBlock: 0, fontSize: "var(--s1)" }}>
                    {a.title}
                  </h3>
                  <p>{a.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
