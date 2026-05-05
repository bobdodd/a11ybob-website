import Link from "next/link";
import type { CSSProperties } from "react";

const placeholderArticles = [
  {
    slug: "music-and-digital-accessibility",
    title: "What Music Knows About Accessibility",
    summary:
      "Music is multimodal by default. Working in it forces designers to think about access from the inside out.",
  },
  {
    slug: "wcag-2-to-ai-web-accessibility-evolution",
    title:
      "From WCAG 2.0 to AI: What a Thousand Research Papers Reveal About Web Accessibility's Evolution",
    summary:
      "An analysis of nearly a thousand peer-reviewed accessibility papers since WCAG 2.0.",
  },
  {
    slug: "ai-in-accessibility",
    title: "AI and Accessibility: Promise, Peril, and the Path Forward",
    summary:
      "What the research actually tells us about artificial intelligence in the lives of disabled people.",
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
    summary: "Where sign-language technology is moving, and what it leaves behind.",
  },
  {
    slug: "data-visualization-accessibility",
    title:
      "Seeing Data Differently: How Accessibility Research Is Rethinking Charts",
    summary:
      "Charts assume sight. The research on alternatives is more interesting than the alt-text debate suggests.",
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
              piece is grounded in named papers; each claim points back to the
              underlying evidence.
            </p>
            <p>
              <Link href="/writing/reading">
                Browse the 2,661-paper review database →
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
              {placeholderArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/writing/${article.slug}`}
                  className="door"
                >
                  <h3 style={{ marginBlock: 0, fontSize: "var(--s1)" }}>
                    {article.title}
                  </h3>
                  <p>{article.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
