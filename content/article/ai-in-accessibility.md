---
title: 'AI and Accessibility: Promise, Peril, and the Path Forward'
publishedAt: '2026-05-06'
tags: []
---

# AI and Accessibility: Promise, Peril, and the Path Forward

## What the Research Actually Tells Us About Artificial Intelligence in the Lives of Disabled People

The conversation about AI and accessibility tends to follow a familiar script: AI will revolutionize access for disabled people, remove barriers, and create a more inclusive world. The reality, as revealed by a growing body of peer-reviewed research, is far more nuanced — and far more interesting.

Over the past several years, researchers at institutions worldwide have been studying how AI actually works (and doesn't work) for people with disabilities. Their findings paint a picture of genuine promise tempered by serious risks, where the most important insights often come not from the technology itself, but from the people it's supposed to serve.

This article draws exclusively on published accessibility research to explore what we know, what we're getting wrong, and where the real opportunities lie.

---

## The Accidental Assistive Technology

One of the most surprising findings in recent accessibility research is that generative AI tools are functioning as effective assistive technology — not because they were designed that way, but because their interaction patterns happen to align with certain accessibility needs.

Meredith Moore's 2025 autoethnographic study, "Executive Dysfunction by Design," documents how tools like ChatGPT and Claude became unexpected cognitive accessibility aids for a person with ADHD. The conversational scaffolding these tools provide — breaking overwhelming tasks into manageable steps, offering patient step-by-step guidance, providing what Moore calls "digital body doubling" — naturally supports executive function needs. The AI's willingness to repeat instructions, maintain context across a conversation, and provide non-judgmental support creates a kind of cognitive scaffolding that many people with executive dysfunction struggle to build for themselves.

This finding is echoed in research on neurodivergent students' use of generative AI. A 2025 study by Jamshed, Naseem, and Potluri found that neurodivergent students genuinely benefited from GenAI tools for managing academic workload — but the picture was complicated. Students with anxiety-related conditions like OCD were particularly resistant to disrupting carefully constructed routines, and there was a persistent tension between the productivity AI enabled and the neuronormative standards that productivity was measured against. The researchers applied the concept of "crip time" — the recognition that disabled people often need to work on different timescales — to show how AI tools can inadvertently reinforce the very pace-of-work expectations that disadvantage neurodivergent people.

Similarly, the TwIPS application demonstrated how large language models can serve as real-time "translators" for autistic users navigating the implicit social rules of text messaging. Participants described the relief of having an on-demand tool to decode ambiguous messages, check the tone of their own responses, and generate socially appropriate replies — tasks that consume enormous mental energy for many autistic people. The Decipher feature, which explains the likely meaning behind vague or sarcastic messages, was the most valued function.

These studies share a common thread: AI is most useful for accessibility when it reduces cognitive load, provides scaffolding for complex processes, and meets users where they are — not when it tries to "fix" disability.

---

## When AI Gets It Wrong: The Stakes Are Higher Than You Think

For disabled people who depend on AI for daily access, errors aren't just inconveniences — they can be dangerous. Research on how blind people handle AI errors reveals the depth of this problem.

A 2024 study by Hong and Kacorri on object recognition errors found that blind users reported strong apprehension toward misrecognitions, particularly in high-stakes situations like food identification (allergens, expiration dates) and medication identification. Most participants preferred to independently verify recognition results rather than rely on sighted assistance, but they could only identify roughly half of the errors the system produced. This means that for every error a blind user catches, another one slips through.

The "misfitting" framework, developed by Alharbi and colleagues in their 2024 study of blind people's experiences with AI visual assistance tools, provides a powerful lens for understanding these failures. Drawing on disability scholar Rosemarie Garland-Thomson's concept of misfitting — where disability emerges from the interaction between body and environment — the researchers show that AI errors create "misfits" between blind users and their digital environments. AI frequently failed with complex document layouts, producing scrambled or incomplete text. It struggled with non-English languages. It generated confident but incorrect descriptions of images. And critically, blind users had no independent way to verify whether AI descriptions were accurate, creating what the researchers term a fundamental asymmetry in AI-assisted access.

Chang and colleagues' 2025 study of ChatGPT's live video chat for blind and visually impaired users revealed similar gaps between promise and reality. ChatGPT performed well on static visual scenes — reading labels, identifying objects, answering specific questions. But critical failures emerged in real-world, dynamic contexts. The system couldn't maintain continuous environmental awareness, struggled with real-time spatial orientation ("Is the door to my left or right?"), and failed to provide the proactive, ongoing descriptions that blind users need when navigating unfamiliar environments. Perhaps most concerning, the system sometimes generated confident but incorrect spatial information — a particularly dangerous failure mode for someone navigating physical space without sight.

These findings point to a fundamental challenge: the people most dependent on AI for access are often the least able to verify its accuracy.

---

## The Homogenization Problem

One of the most concerning findings to emerge from recent research is the tendency of generative AI to homogenize outputs — producing increasingly similar results that flatten individual differences.

Zastudil and colleagues' 2025 study on using GenAI to help configure augmentative and alternative communication (AAC) devices provides a striking example. Visual scene displays (VSDs) — image-based communication tools for people who cannot speak — are effective precisely because they are deeply personalized to each user's interests, relationships, and communication goals. When the researchers tested an AI prototype that suggested communication hotspots for VSDs, they found that while it made configuration 17% faster and increased user confidence, it also produced significantly more homogeneous results.

VSDs created with AI assistance were measurably more similar to each other than those created without it. The number of unique communication options dropped from 54% to 37%. And the AI nearly eliminated one entire category of communication — social closeness hotspots (expressions meant to maintain relationships, like greetings or terms of endearment) dropped from 5.3% to just 0.7%. Users also exhibited concerning over-reliance: 61.8% of AI-generated suggestions were accepted without any modification.

For AAC users — who are often minimally verbal autistic children — this homogenization could mean the difference between a communication tool that reflects their unique personality and interests, and a generic device that works for no one in particular.

This pattern extends beyond AAC. Research on AI in creative contexts by Bennett, Shelby, and Rostamzadeh found that disabled artists had developed rich ecosystems of "access hacks" long before generative AI existed — a blind photographer who uses camera sounds and tactile feedback to compose shots, a leatherworker who adapted tools for one-handed use, a musician who developed keyboard macros for limited hand mobility. These artists viewed AI not as a replacement for their creative process, but as another tool in an existing toolkit. They expressed concern that AI-driven standardization could actually reduce the diversity of creative expression that their adaptive approaches had fostered.

---

## AI for Accessibility Testing: Better Together

If AI can introduce accessibility problems, can it also help find them? The answer, according to a 2025 benchmarking study by Kumar, Padath, and Wang, is a qualified yes — but only as part of a hybrid approach.

The researchers constructed the first expert-validated benchmark for PDF accessibility evaluation, testing five large language models against seven accessibility criteria including alternative text quality, logical reading order, semantic tagging, and colour contrast. GPT-4-Turbo achieved the highest overall accuracy at 85%, but all models struggled with edge cases — particularly the "Not Present" and "Cannot Tell" categories that require recognizing when information is missing or insufficient for evaluation.

A revealing finding: Claude 3.5 hallucinated alternative text descriptions in 32% of "Cannot Tell" cases — fabricating descriptions for images that didn't have any alt text, then evaluating those fabricated descriptions for quality. This is a sobering reminder of LLMs' tendency to generate plausible-sounding content even when the correct answer is "I don't know."

The comparison with traditional automated checkers (Adobe Acrobat Pro, PAC 2024, axesPDF, CommonLook, PAVE) revealed complementary strengths. Rule-based tools excel at structural verification — detecting missing tags, non-embedded fonts, absent alt attributes — but cannot evaluate semantic quality. LLMs can assess whether alternative text actually conveys an image's meaning, or whether a reading order logically follows the visual layout, but they sometimes hallucinate and apply inconsistent standards.

The researchers propose a three-tiered approach: automated checkers for structural screening, LLMs for semantic and contextual assessment, and human experts for resolving conflicts and evaluating high-stakes documents. No single approach is sufficient. Research consistently shows that automated tools detect only 25-30% of accessibility issues. The question isn't whether to use AI for accessibility testing — it's how to combine it intelligently with other methods.

---

## The Web Accessibility Gap

It's worth pausing to note the scale of the problem AI is being asked to help solve. The WebAIM Million — an annual analysis of the top one million home pages — consistently finds that over 95% of home pages have detectable WCAG conformance failures. The most common errors (low contrast text, missing alternative text, empty links, missing form labels) have remained stubbornly persistent year after year, despite being among the simplest accessibility issues to fix.

A 2025 study by Yu and colleagues explored using generative AI to restructure entire e-commerce page layouts for screen reader users. Their approach reduced WCAG Level A violations on Amazon product pages from 16 to just 1, while preserving content integrity. This suggests that GenAI could address structural accessibility issues that go beyond fixing individual elements — fundamentally rethinking how pages are organized for non-visual navigation.

But even this promising approach comes with caveats. The restructured pages need to maintain feature parity with originals, the approach requires careful prompt engineering, and it currently works best for specific page types with predictable structures.

---

## Smart Glasses and Extended Reality: New Frontiers

AI-powered extended reality devices represent another frontier. A 2025 co-design study by Gamage and colleagues explored how smart glasses (specifically the Apple Vision Pro) could support adults with cerebral visual impairment (CVI) — a condition affecting higher-order visual processing that is set to become the leading cause of vision impairment.

Unlike ocular conditions that affect the eyes themselves, CVI disrupts the brain's ability to process visual information — impacting object recognition, facial perception, and the ability to handle complex visual scenes. The researchers worked with two adults with CVI over eight months, testing over 80 design options across six key challenges.

The findings were nuanced. Smart glasses effectively helped with locating objects (through visual highlighting and environment darkening), reading text (through combined text-to-speech and visual overlays), face-to-face conversations (through a virtual frame around the speaker with dimmed surroundings), and recognizing people (through virtual name tags). One co-designer described the conversation aid as recreating "what vision would feel like without CVI."

But features aimed at directing visual attention — markers, prompts, guides — actually caused sensory overload and discomfort, adding cognitive load rather than reducing it. And even between two people with the same diagnosis, preferences differed dramatically due to their distinct CVI profiles. This underscores a persistent theme: accessibility solutions must be deeply personalizable, and AI that assumes one-size-fits-all will miss the mark.

---

## Data Visualization and Multimodal Access

Data visualization is one of the most stubbornly inaccessible domains for blind and low-vision users. Charts, graphs, and data plots convey information visually that is nearly impossible to access through screen readers alone. A 2024 study by Seo, Kamath, and Zeidieh explored integrating LLMs into the MAIDR (Multimodal Access and Interactive Data Representation) framework, which combines text descriptions, sonification (data represented as sound), braille output, and now AI-powered conversational interaction.

The results revealed that blind users exhibited diverse modal preferences — some relied heavily on sonification for initial exploration, then used the LLM for specific questions, while others started with text descriptions or went directly to conversational AI. A critical "trust-but-verify" dynamic emerged: participants valued the LLM's natural language explanations but cross-referenced them against sonification and braille to catch potential errors.

This multimodal approach — giving users multiple independent channels to access the same information — may be the most robust model for AI-assisted accessibility. When users can verify AI-generated descriptions against sonification patterns, or check LLM interpretations against braille data, they gain an independence and confidence that no single modality can provide alone.

---

## The Fairness Gap: AI Bias and Disability

The accessibility research community has been sounding the alarm about AI fairness for disability for several years, and the concerns have only grown more urgent.

A landmark 2020 research roadmap by Guo, Kamar, Vaughan, and others identified five categories of potential harm from unfair AI: quality of service degradation (voice-activated devices not recognizing atypical speech), harms of allocation (hiring systems filtering out disabled applicants), denigration (flagging disabled users as anomalies), stereotyping (reinforcing limited views of disability), and exclusion from consideration entirely. They mapped these risks across multiple disability types and AI technology categories, creating a structured framework that remains the most comprehensive reference in the field.

What makes disability bias particularly insidious is its invisibility. As White argued in his 2020 analysis, the training data underrepresentation problem is complicated by the privacy risks of disability-related data collection — people must disclose disability status to be included, creating vulnerability. And unlike demographic categories that can be observed and counted, many disabilities are invisible, intermittent, or resist the clean categorical boundaries that machine learning systems require.

Tanis and Lewis's 2020 paper on "The Dignity of Risk" adds another dimension: many people with cognitive disabilities are responding to AI risks by withdrawing entirely from participation — refusing to use online job applications, declining to share data, or avoiding AI-enabled services. While understandable as self-protection, this withdrawal further marginalizes an already excluded group, creating a vicious cycle where non-participation leads to even less representation in AI training data.

The research community increasingly argues that the standard AI fairness framework — focused primarily on race and gender — is inadequate for disability. Wolf and Ringland's work on explainable AI (XAI) demonstrated that even well-intentioned AI transparency efforts fail when they don't consider accessibility. Explanations need to be available in multiple modalities, adaptable to different cognitive needs, and designed for the specific contexts in which disabled people encounter AI decisions.

---

## "Nothing About Us Without Us" in the AI Age

Perhaps the most important finding across all of this research is about process, not technology. Study after study demonstrates that AI developed without meaningful involvement of disabled people produces solutions that miss the mark — sometimes spectacularly.

Kamikubo and colleagues' 2025 study on collaboration in sign language AI provides the most detailed evidence. Surveys of ML practitioners revealed alarming gaps in Deaf cultural awareness: only 31% answered all terminology questions correctly, 51% considered "hearing impaired" appropriate terminology (the Deaf community rejects this term), and 74% incorrectly identified American Sign Language as universal. Misconceptions persisted even among researchers with sign language processing experience.

In paired co-design sessions, the divergence in priorities was striking. ASL experts asked questions about community accountability, ethical risks, and long-term cultural impact. ML experts asked about datasets, deliverables, and timelines. One Deaf participant's warning captures the stakes: "This could be a form of genocide. Currently, our community celebrates the diverse forms of signing and characteristics. With human interpreters, we already have to code switch to ensure the L2 would understand. So, now with AI, what would that look like?"

This concern about language erasure — the risk that AI could flatten the rich diversity of sign languages into a standardized, simplified version — is not hypothetical. It parallels the homogenization findings from AAC research, from creative AI research, and from broader studies of generative AI's tendency to converge toward similar outputs.

The concept of the "disability dongle" — coined by disability advocate Liz Jackson to describe well-intentioned but ultimately useless technology solutions created for disabled people by non-disabled people — is a useful touchstone. Sign language recognition gloves, stair-climbing wheelchairs, and many other widely celebrated "accessibility innovations" have been rejected by the communities they were designed to serve, because their creators never asked whether the solution matched an actual need.

---

## What the Research Tells Us: Principles for AI in Accessibility

Drawing on this body of work, several principles emerge:

**1. AI works best as scaffolding, not replacement.** The most successful applications — cognitive scaffolding for executive dysfunction, communication translation for autistic users, multimodal data access for blind users — augment human capability rather than substituting for it. They give people tools to do things they want to do, not things technology assumes they should want.

**2. Personalization is not optional.** The CVI smart glasses study, the AAC homogenization findings, and the neurodivergent productivity research all demonstrate that even within the same disability, individual needs vary enormously. AI systems that don't support deep personalization will fail the people who need them most.

**3. Error handling matters more than accuracy.** For populations that depend on AI for basic access, the question isn't just "how accurate is this system?" but "what happens when it's wrong?" Blind users need ways to independently verify AI outputs. All users need systems that acknowledge uncertainty rather than hallucinating confident answers.

**4. Combine approaches rather than seeking a single solution.** The PDF accessibility research demonstrates this clearly: automated tools, AI, and human judgment each catch different issues. No single approach is sufficient. The most robust accessibility strategies layer multiple methods.

**5. Involve disabled people from the start — and not just as testers.** The sign language AI research, the co-design studies, and the participatory design work all point to the same conclusion: meaningful involvement means shared decision-making power, not just feedback on pre-made prototypes. The gap between what technologists build and what disabled people need remains wide when involvement is superficial.

**6. Watch for what AI takes away, not just what it adds.** Homogenization of AAC content. Reinforcement of neuronormative productivity standards. Potential erosion of sign language diversity. The costs of AI integration aren't always visible in efficiency metrics or accuracy scores. They show up in the flattening of individual expression, the narrowing of communication options, and the subtle pressure to conform to AI-determined norms.

---

## Looking Forward

The research paints neither a utopian nor dystopian picture of AI in accessibility. Instead, it reveals a technology with genuine potential that is deeply shaped by who builds it, how they build it, and whether the people most affected have meaningful say in the process.

The most exciting work isn't happening in AI labs alone — it's happening at the intersection of technology and lived experience, where disabled researchers, designers, and community members are shaping AI to serve their actual needs rather than someone else's assumptions about those needs.

The challenge now is to scale that kind of collaboration. To move from individual co-design studies to systemic change in how AI is developed. To ensure that accessibility isn't an afterthought in AI development but a fundamental design constraint from the beginning.

The research is clear: the technology can help. But only if we build it right.

---

*This article draws exclusively on peer-reviewed research from the ACM SIGACCESS Conference on Computers and Accessibility (ASSETS), the ACM CHI Conference on Human Factors in Computing Systems, and related venues. All findings cited are from studies in the a11y paradise literature review database at [a11ybob.com](https://a11y-paradise.onrender.com).*
