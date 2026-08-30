---
title: 'From WCAG 2.0 to AI: What a Thousand Research Papers Reveal About Web Accessibility''s Evolution'
publishedAt: '2026-05-06'
tags: []
---

# From WCAG 2.0 to AI: What a Thousand Research Papers Reveal About Web Accessibility's Evolution

**Author:** Bob Dodd
**Published:** 2026-03-23

*An analysis of nearly a thousand peer-reviewed accessibility research papers published since WCAG 2.0, examining what has worked, what has failed, and where the field is heading — from the dynamic web breaking evaluation tools to AI-powered adaptation replacing developer compliance.*

---

When WCAG 2.0 was published in December 2008, the web was a fundamentally different place. Pages were largely static HTML and CSS documents. Facebook was four years old and still looked like a college directory. The iPhone had been on sale for barely a year. Screen readers could linearize a web page and read it top to bottom with reasonable confidence that the experience, while impoverished, would be functional.

Nearly two decades later, I have reviewed close to a thousand peer-reviewed accessibility research papers published since that watershed moment. What follows is what the research actually tells us — not about aspirations or marketing promises, but about what has worked, what has failed, and where the field is heading.

## The WCAG 2.0 Transition: Harder Than Anyone Expected

The publication of WCAG 2.0 was supposed to be an improvement in every dimension: technology-independent principles, testable success criteria, a clearer structure organised around four principles (Perceivable, Operable, Understandable, Robust). The reality was messier.

Researchers at the Technical University of Madrid documented what happened when they tried to update their accessibility evaluation tool, Hera-FFX, from WCAG 1.0 to 2.0. The old standard had two levels of hierarchy: guidelines and checkpoints. The new one had principles, guidelines, success criteria, situations, sufficient techniques, advisory techniques, and failures. The team had to develop three entirely new aggregation algorithms — permissive, restrictive, and semi-permissive — just to handle the way results needed to propagate upward through this hierarchy. One passing technique could satisfy a success criterion (permissive), but one failure could block an entire criterion (restrictive). The maths of accessibility conformance had become genuinely complex.

Two years after WCAG 2.0's publication, the same team could find only four tools that supported the new standard. None of them fully reflected its structure. A survey of 15 free evaluation tools revealed that not a single one covered all 11 features the researchers considered desirable for an accessibility evaluation tool — things like evaluating local pages, handling password-protected content, assessing rendered (not just source) HTML, or supporting multi-session evaluations. The tools were, in one IBM researcher's memorable phrasing, "unclear, cumbersome, and incomplete."

A framework for filtering WCAG guidelines, developed by researchers from Makerere University, Loughborough University, and Radboud University, addressed the usability problem from the other direction. Their prototype organised WCAG 1.0 guidelines into four dimensions: web page component, disability type, level of use, and document structure. When tested with 20 web developers and 10 IT managers, 18 out of 20 developers preferred the filtered version over raw WCAG. The raw guidelines were described as difficult to navigate, with no control over information volume. This finding from 2009 anticipated what the W3C itself would eventually do with its "How to Meet WCAG" quick reference — but the underlying problem persists. The guidelines remain difficult for their target audience.

Australia's 2011 National Transition Strategy required all government websites to meet WCAG 2.0 Level AA by 2014. Researchers studying the rollout found little demonstration of compliance internationally, and noted that formal adoption and actual conformance were very different things. A comparative study of US and EU legislative approaches found that the US, with its litigation-driven enforcement model, scored higher on compliance than the EU27 average with its mandate-based approach. The uncomfortable conclusion: threat of lawsuits works better than good intentions.

## The Dynamic Web Broke Everything

The most fundamental challenge to accessibility since WCAG 2.0 has not been the guidelines themselves but the transformation of the web from documents to applications.

A 2008 W4A conference report identified seven major research challenges, and the first was that evaluation tools could not evaluate Web 2.0 pages. Assistive technologies — designed to linearize static content — were struggling with pages that could change at any moment, from any direction, without a page refresh.

WAI-ARIA was supposed to solve this. The specification added roles, states, and properties to HTML so that developers could communicate the semantics of custom widgets and dynamic updates to assistive technologies. ARIA live regions allowed marking containers as holding dynamic content, with politeness levels (off, polite, assertive) controlling how urgently updates should be announced.

A detailed 2010 case study of implementing live regions in eBuddy, a web-based instant messenger with over 100 million users, revealed the gap between specification and practice. The straightforward approach — marking all dynamic areas as polite live regions — worked fine with 50 contacts. With the average eBuddy contact list of 160 users, it turned into an unmanageable stream of interleaved contact updates and chat messages that overwhelmed screen reader users. The developers invented a "tally queue" — grouping updates by type, showing counts instead of individual announcements, and letting users decide when to drill in. It worked, but it was custom client-side logic that went well beyond what ARIA specified. The previously available "rude" politeness level and channel attribute had been removed from the spec to reduce complexity, but that simplification created gaps developers then had to solve through exactly the kind of custom code the spec was supposed to eliminate.

By 2013, researchers at the University of Lisbon quantified just how badly traditional evaluation was failing. They built QualWeb, an evaluation framework that assessed web pages at three levels: before browser processing (the traditional approach), after browser processing (including JavaScript), and after simulating user interactions to reach all application states. The results were stark. The average number of evaluated HTML elements per page jumped from 1,152 before processing to 1,666 after processing to 19,964 after interaction — a twelvefold increase. Critically, the relative growth of failures exceeded the growth of passes when moving to interaction-triggered states, meaning dynamically generated content was *less* accessible than static content.

Their most devastating finding: regular evaluations overlooked 92% of application states. Every automated accessibility scan that only checked the initial page load was missing the vast majority of the content users actually interacted with.

A 2015 paper from the University of Washington proposed a radical alternative: instead of depending on developers to implement ARIA correctly, put the accessibility intelligence in the screen reader itself. Their "Look Ma, No ARIA" approach used a widget classifier to identify chat components and presented them through a dual-voice interface that scored higher in usability than the ARIA-marked original. It was an admission that the developer-dependent model was failing. By 2024, researchers were building tools like QualState specifically to explore single-page application states for accessibility evaluation — the gap between what automated tools assess and what users experience continues to widen as the web moves to React, Angular, and Vue architectures.

## The Older Adults Paradox

The research on older adults consistently produces a finding that surprises people: age itself is not the primary barrier. Experience is.

A 2009 study of 1,200 users of an Austrian railway ticketing portal found that older adults differentiated in their attitudes toward the internet according to their experience, not their age. Those who used online ticketing found it easy and comfortable. Those who didn't cited complexity — not inability. Contrary to common belief, advertisements and interactive elements were not universally perceived as negative by older users. Contextually relevant offers were actually welcomed as useful information.

A physiological study using galvanic skin response (GSR) measurements with 23 older web users found that age was not a statistically significant factor in stress levels when interacting with Web 2.0 content. The ANOVA results were clear. But the older users were a markedly non-homogeneous group — unlike younger participants who showed consistent interaction patterns, older users showed enormous variance in their GSR measurements with no identifiable common patterns. Some were comfortable. Others exhibited what the researchers identified as hesitancy — approaching tasks tentatively, checking pages before acting, and crucially, blaming themselves when errors occurred ("Oh no. Look at that") while younger users blamed the computer ("It's the keyboard").

This hesitancy finding has direct design implications that go beyond WCAG compliance. Clear process guidance, explicit step-by-step indicators, error prevention rather than error correction, and reassurance that mistakes are normal and recoverable — these are not things you can test with an automated scanner.

Research from 2010 identified three barriers preventing older adults from benefiting from accessible technology: lack of awareness that their needs exist, lack of awareness that solutions exist, and difficulty obtaining or using those solutions. The researchers noted that older users are poorly served by approaches designed for severe, stable, single-category disabilities — because aging typically involves gradual, fluctuating, multi-dimensional changes that don't map to traditional disability categories.

Alan Newell's influential 2012 paper posed a question that still hasn't been adequately answered: why do websites that are technically "accessible" but clearly "unusable" not prompt revision of the guidelines? The tension persists through WCAG 2.1 and 2.2, which are more comprehensive yet haven't resolved the gap between technical conformance and practical usability.

## Beyond Vision: Cognitive Accessibility's Slow Rise

Web accessibility's historical centre of gravity has been visual impairment and screen readers. The research since 2008 shows a gradual but significant expansion toward cognitive accessibility — though the tools and standards still lag well behind.

A 2009 diary study of older adults' everyday web interactions found that the most impactful barriers were cognitive and motor — remembering steps, understanding jargon, controlling a mouse — not visual. This challenged the community's assumption hierarchy.

The work on dyslexia is particularly illuminating. A 2011 analysis found that dyslexic errors constituted 0.7% of web lexical errors — a small percentage, but at web scale, a substantial volume of content authored by people with dyslexia exists online. A comprehensive 2012 survey produced 41 guidelines specific to dyslexia that WCAG 2.0 did not cover: avoid pure white backgrounds (use #FFFFE5 instead), prefer sans-serif or monospaced fonts at minimum sizes, avoid justified text. Eye-tracking studies confirmed these mattered — fixation duration differences between dyslexic and non-dyslexic readers were statistically significant (0.23s vs 0.20s, p<0.038), and 63.64% of participants preferred 26pt font size. The Firefixia toolbar, tested on a Brazilian government tax site, found that the most valued features were adjustable text size, non-justified alignment, and distinguishable link colours.

One of the most important findings came from a 2013 comparison of text simplification approaches. Researchers found that interactive synonyms — where users could click difficult words to see simpler alternatives — were rated significantly more readable (p=0.015) and understandable (p=0.001) than automatic word substitution. User control over simplification was more effective than automated replacement. This aligns with a broader finding from the Educational FACILITA project in Brazil, which used lexical elaboration (adding explanations for complex words) rather than simplification (replacing them). The approach preserved the original text while scaffolding understanding, supporting vocabulary acquisition rather than merely bypassing difficulty.

This matters because functional illiteracy is not a marginal issue. Brazil's National Indicator of Functional Literacy reported that 7% of the population was illiterate, 21% at rudimentary level, 47% at basic level, and only 25% at advanced level. WCAG includes success criteria on reading level (3.1.5) and unusual words (3.1.3), but practical tools for actually implementing these requirements at scale have been almost nonexistent.

## Content Adaptation: The Best Web for Each One

A persistent thread through the research is the tension between universal design and personalisation. The phrase "one Web content for everyone is not as effective as the best Web content for each one" appears in a 2011 paper from the University of Bologna, but the sentiment runs through the entire body of work.

The GAPforAPE system (GreaseMonkey And Profiling for Accessible Pages Enhancement) demonstrated client-side content adaptation using the IMS ACCLIP standard for user profiling. When tested with 16 blind Facebook users, it revealed a catalogue of barriers — inaccessible chat, poorly organised heading hierarchies, cyclic navigation links, ambiguous link text, automatic page refreshes disrupting screen reader navigation — and addressed them through scripts that reorganised the DOM, added WAI-ARIA live regions for chat, and removed redundant content. Low-vision users got different adaptations: high-contrast colour schemes or enlarged text with simplified layouts.

The concept of semantic accessibility, articulated in a 2009 railway ticketing study, adds another layer. The researchers distinguished three types of accessibility: syntactic (correct code for assistive technologies), semantic (predictable behaviour and consistent element placement), and procedural (consistent interaction sequences). WCAG primarily addresses syntactic accessibility. But older adults and people with cognitive disabilities face semantic and procedural barriers — unpredictable layouts, inconsistent interaction patterns, unclear process flows — that standards alone do not resolve.

Adaptive systems research reinforced this. A 2015 study found that interface preferences varied by individual, not by age group or disability type. Users felt "judged" by quantitative performance notifications and preferred adaptations they could control. The message from the research is consistent: personalisation works, but only when users have agency over it.

## User Research: The Methods Are the Message

The research methods used to study accessibility have evolved as significantly as the technologies under study.

Eye tracking combined with galvanic skin response measurements showed that physiological data could reveal frustration points that users never reported in surveys. A 2013 experiential transcoding study used eye-tracking to identify common scanpaths among sighted users, then used those patterns to restructure content for non-visual access — bridging the gap between visual and non-visual experiences through empirical observation rather than developer assumptions.

Participatory design and co-design methods appear in 135 papers in the database. A 2015 study on wearable technology design with blind and visually impaired participants found that medium-fidelity tangible materials with structured scenarios were most effective — neither too abstract nor too finished. The research consistently shows that involving disabled users as co-designers rather than test subjects produces fundamentally different (and better) outcomes.

But a critical 2014 paper asked a provocative question: are users the gold standard for accessibility evaluation? The study found that user expertise was the strongest predictor of barrier identification, and that a WCAG-violating site could be perceived as accessible by most test participants — and vice versa. A 2014 exploratory study of users with physical disabilities found dramatically different navigation strategies even among users with the same disability. Input device mattered more than disability type.

These findings do not argue against user testing — they argue against using it as the sole evaluation method, and against treating disabled users as a homogeneous group.

## The Mobile Shift

When WCAG 2.0 was published, mobile web accessibility was barely a concept. By 2013, the W3C published a definitive framework paper arguing that mobile accessibility was not a separate discipline — WCAG 2.0 applied to mobile, but needed reinterpretation. The keyboard accessibility success criterion (SC 2.1.1) applied to touchscreens. Target size guidance applied to finger taps. Responsive design was an accessibility technique.

This reinterpretation was necessary because mobile introduced something accessibility research had not previously grappled with at scale: situational impairment. A 2010 paper demonstrated that accessibility solutions originally developed for disabled users — like long key press error correction and bounce error handling — could be directly migrated to solve problems encountered by everyone on small devices. The concept collapsed the distinction between disability-driven and context-driven accessibility needs.

The Spoken Web Application Framework, developed for illiterate users in India, challenged the assumption that accessibility was only about making visual content available to disabled users. Voice-based web interaction for people who could not read was accessibility in a different register entirely — digital inclusion that shared techniques with assistive technology but served a population rarely considered in Western accessibility discourse.

## AI: Promise, Peril, and the Long Game

Artificial intelligence appears in 146 papers in the database, and its trajectory tells a story of increasing ambition matched by increasing capability.

The early applications were modest: classification of web lexical errors to estimate dyslexia prevalence (2011), Bayesian network classifiers achieving 80% accuracy in predicting web page accessibility (2011), decision trees for personalising video annotations (2011). These were useful but limited — pattern recognition applied to accessibility data.

The VizWiz project from 2010 anticipated the AI accessibility revolution by a decade. This iPhone app let blind users photograph their surroundings, ask a question, and receive answers from human workers — a combination of mobile hardware, crowd intelligence, and a simple interaction model that presaged Be My Eyes, Aira, and eventually AI vision models like GPT-4V and Google Lookout. The key insight was that human intelligence could bridge gaps that automated approaches could not. The question now is whether AI can match that human capability.

Natural language processing evolved from lexical elaboration tools that identified complex words using dictionary lookups (2010) to systems that could simplify content, recognise named entities, and generate reading assistance. The Educational FACILITA project demonstrated the architecture — client-side browser integration calling server-side NLP services — that would later become the standard pattern for AI-powered accessibility tools.

Computer vision grew from image classification to scene understanding. Crowdsourcing evolved from answering visual questions to labelling accessibility features in urban environments. Machine learning moved from predicting accessibility violations to proposing fixes. By 2024-2025, the research is exploring large language models for automated accessibility repair, AI-generated alt text at scale, and intelligent assistive technologies that adapt to individual users without explicit configuration.

## What Has Actually Worked

Looking across nearly a thousand papers and nearly two decades of research, several things have clearly worked:

**ARIA, imperfectly.** Despite the implementation challenges, ARIA live regions, landmarks, and roles have fundamentally changed what is possible for screen reader users on the modern web. The specification is well thought out. The problem is developer adoption and correct usage, not the specification itself.

**The shift-left movement.** Research consistently shows that retrofitting accessibility is more expensive and less effective than designing for it from the start. The tools and processes for early-stage accessibility have improved significantly.

**Participatory design.** The most impactful accessibility solutions in the research are those that involved disabled users as co-designers throughout the process, not as test subjects at the end.

**Mobile convergence.** The recognition that mobile accessibility and disability accessibility share techniques and principles has been productive for both communities.

## What Has Not Worked

**Guidelines as the primary mechanism for change.** Seventeen years after WCAG 2.0, the web is not measurably more accessible. Guidelines are necessary but manifestly not sufficient. Enforcement works better than education, and litigation works better than mandates.

**The developer-dependent model.** The assumption that developers will learn and correctly implement accessibility — whether through WCAG conformance, ARIA markup, or semantic HTML — has not been validated at scale. Tools that put intelligence in the AT or the browser, rather than depending on developers, show more promise.

**Treating disability as a homogeneous experience.** Users with the same disability use dramatically different strategies, tools, and preferences. Age groups are not uniform. Cognitive accessibility cannot be reduced to a checklist.

**Static evaluation for a dynamic web.** The research is unambiguous: evaluating only the initial page load provides an erroneous perception of accessibility. The web moved to dynamic applications; evaluation largely did not follow.

## Where Research Is Heading

The trajectory of the research points toward several convergences:

**AI-powered adaptation over developer compliance.** Rather than relying on developers to mark up content correctly, AI will increasingly detect and repair accessibility barriers automatically — in the browser, in the AT, or at a proxy layer. The question is not whether this will happen but whether it will happen well.

**Personalisation as a first-class principle.** The W3C's personalization specifications reflect what the research has shown for fifteen years: one-size-fits-all accessibility is a contradiction. The future is content that adapts to individual capabilities and preferences, described through standard profiles.

**Physiological and behavioural measurement.** Moving beyond task completion and self-report surveys to GSR, eye-tracking, and interaction pattern analysis provides a richer picture of actual user experience. As these methods become cheaper and more automated, they will likely become standard in accessibility evaluation.

**Cognitive accessibility as equal priority.** The research base for cognitive accessibility has grown enormously, but the standards and tools have not kept pace. This gap will close — not because the community has suddenly recognised cognitive disabilities, but because aging populations in every developed country are making cognitive accessibility a mass-market concern.

**Cross-device, cross-context, cross-ability.** Situational impairment, aging, and the proliferation of interaction modalities (voice, gesture, gaze) are dissolving the boundary between "accessible" and "usable." The research increasingly treats accessibility as a dimension of quality that applies to all users, not a special accommodation for a defined group.

## The Uncomfortable Truth

The most consistent finding across this entire body of research is one that the industry would prefer not to hear: the web has not become substantially more accessible since WCAG 2.0 was published. The guidelines have improved. The tools have improved. The research has deepened our understanding enormously. Screen reader support is better. ARIA exists. Mobile accessibility is on the agenda. AI offers genuine promise.

But the percentage of websites that are actually accessible to people with disabilities has not changed in a way that matches the volume of effort, research, and standards work invested. The barrier is not technical. It is organisational, economic, and cultural. The research tells us what to do. It has told us for years. The gap is between knowing and doing.

That gap is where the next decade of accessibility work will either succeed or fail — not in better guidelines, not in smarter AI, but in the systemic changes that make accessibility a non-negotiable quality attribute rather than an optional enhancement. The research has given us the map. Whether we follow it is not a research question.
