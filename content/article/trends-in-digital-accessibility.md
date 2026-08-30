---
title: 'Trends in Digital Accessibility Research: What Researchers Are Investigating, Finding, and Flagging (2020-2025)'
publishedAt: '2026-05-06'
tags: []
---

# Trends in Digital Accessibility Research: What Researchers Are Investigating, Finding, and Flagging (2020-2025)

## Six years of peer-reviewed accessibility scholarship reveal shifting priorities, emerging populations, and uncomfortable gaps

What are accessibility researchers paying attention to? What questions are they asking, and what are they finding? A review of 584 peer-reviewed papers published between 2020 and 2025 — primarily from the ACM SIGACCESS Conference on Computers and Accessibility — reveals several clear patterns in where research attention is being directed, what kinds of evidence are being gathered, and what the researchers themselves say is missing.

## Generative AI Has Become a Central Research Concern

The most visible shift in recent accessibility research is the arrival of generative AI as both a tool and a problem. Papers from 2024 and 2025 investigate LLMs and generative AI across nearly every dimension of accessibility — assistive technology, content creation, automated testing, communication support, and trust.

Researchers are investigating AI as assistive technology. CARTGPT (2025) combines human CART captioning with GPT-4 to detect and correct transcription errors in real time. SoundNarratives (2025) uses audio-language models to generate contextual scene descriptions for deaf and hard-of-hearing users that go beyond simple sound labels to describe what is happening and why it matters. DescribePro (2025) pairs human audio describers with AI assistance to scale video accessibility. LectureAssistant (2025) uses vision-language models to make lecture videos navigable for blind students. EditScribe (2024) makes image editing accessible to blind users through natural language interaction, and AltCanvas (2024) provides a tile-based interface for visually impaired people to create illustrations using generative AI.

Researchers are also examining whether LLMs can fix accessibility problems at scale. AccessGuru (2025) combines traditional automated testing with LLMs to both detect and correct web accessibility violations. Studies have benchmarked LLM approaches to PDF accessibility evaluation. And two studies (2024, 2025) evaluated whether ChatGPT and Claude generate WCAG-compliant code. The 2024 study found that code produced by 88 developers prompting ChatGPT contained accessibility violations at rates comparable to hand-written code. The 2025 study found that accessibility-oriented prompts improved output, but neither model produced reliably accessible results.

What distinguishes the more recent work is the attention to how disabled people actually use these tools — and where the tools fail them. A study of 19 blind participants (2024) found they viewed ChatGPT as "the king of knowledge" but developed sophisticated verification strategies — cross-referencing with search engines, asking follow-up questions to probe for inconsistencies — because they could not visually confirm AI outputs. Disabled creatives (2024) described using generative AI as an "access hack," circumventing physical barriers through text-to-image generation, while also choosing not to use AI when it threatened the embodied, material aspects of their practice. Neurodivergent students (2025) described AI not as a shortcut but as a cognitive scaffold that helped them manage executive function challenges.

The research is also documenting specific failures. When researchers (2025) asked the same model to describe the same image multiple times and showed blind users the variations, their ability to identify unreliable claims increased by 4.9 times compared to reading a single description (mean 2.62 unreliable claims identified versus 0.53). AI outputs sound authoritative even when fabricating content, and users who cannot independently verify visual information face particular risks. A study of 348 real-world chat logs from a GPT-4-powered career chatbot for neurodivergent job-seekers (2025) found systematic misalignment — the chatbot provided neurotypically-coded advice that contradicted users' authentic communication styles. Research on AI-generated visual scene displays for augmentative communication devices (2025) found that AI suggestions homogenised designs, reducing the personalisation essential for effective AAC. And a study of age bias in LLMs (2025) found ChatGPT exhibited age-related stereotyping in its responses.

For teachers with vision impairments in India (2025), generative AI's promise was constrained by infrastructure: most lacked reliable internet, had limited AI exposure, and worked without institutional adoption support. The paper's subtitle — "A Bridge Too Far?" — captures a gap between what these technologies can theoretically do and what specific populations can actually access.

## Neurodivergent Experiences Are Being Studied in New Ways

Recent accessibility research is investigating ADHD, autism, and neurodiversity with a breadth that goes well beyond traditional assistive technology questions. Studies address ADHD social media communities where users navigate validation and scepticism about their diagnoses (2023); programmable fidget robots co-designed with adults with ADHD (2024); sound masking approaches for autistic noise sensitivity (2024); browser extensions for online attention management (2025); video watching experiences customised for ADHD viewers (2025); and workplace disclosure of neurodivergence in software engineering (2025).

The research is notable for engaging with cognitive, social, and emotional dimensions of disability rather than focusing solely on interaction mechanics. A critical review (2025) examined 27 emotional dysregulation measures used in ADHD research and found that 20 used normative language — loaded adjectives like "excessively" and "overwhelmed" — framing ADHD emotional responses as deviations from a neurotypical standard. The paper argues that these instruments embed assumptions that pathologise ADHD experience rather than measuring it on its own terms.

An autoethnographic paper (2025) on executive dysfunction and healthcare barriers describes a paradox: generative AI tools have become effective assistive technology for managing executive dysfunction, while the healthcare systems designed to treat ADHD require patients to navigate bureaucratic processes that demand exactly the executive functioning skills that ADHD impairs.

Some of this work draws on theoretical frameworks that reframe disability itself. NeuroBridge (2025), an LLM-powered platform, is grounded in the "double empathy problem" — the theory that communication breakdowns between autistic and neurotypical people are bidirectional misunderstandings, not deficits in autistic social cognition. Rather than training autistic users to communicate more neurotypically, NeuroBridge helps neurotypical people understand and adapt to autistic communication styles. This represents a notable inversion: asking the majority to adapt rather than the minority.

## Disabled Researchers Are Producing a Different Kind of Knowledge

A growing body of accessibility research uses autoethnography — first-person research where disabled scholars systematically examine their own experiences with technology. These studies span a wide range: a blind person navigating recreational travel (2020); disabled interns reflecting on a virtual summer internship (2021); a researcher chronicling life with chronic illness (2022); a researcher with cerebral palsy documenting life as an international PhD student (2025); a visually impaired traveller navigating airports (2024); deaf and hard-of-hearing musicians documenting 15 months of technology-mediated performance practice (2025); and a researcher using multimodal generative AI during a period of temporary disability (2025).

What makes these contributions significant is not just the personal perspective but the concepts they produce. Atieh Taheri's autoethnography (2025) of three accessibility projects she led as a researcher with Spinal Muscular Atrophy identifies the gap between "technical sufficiency and experiential adequacy" — a system can be functionally complete yet fail to provide the embodied sense of control and agency that makes interaction meaningful. One of her projects asked what it would feel like to walk, as someone who has never walked. The VR simulation was not about rehabilitation but about imaginative exploration of bodily experience. She reports that reviewers questioned the work — an instance of what she describes as epistemic friction between embodied knowledge and disciplinary expectations about what constitutes legitimate research.

A 2025 study of seven disabled innovators — including the creators of NVDA, SoundPrint, and DeafFriendly — found that their technologies were "artifacts of disability culture," infused with values of community building, "crip knowledge" (embodied expertise from living with disability), and resistance to ableist norms. The innovators described moving from consumers of access to producers of it. The researchers concluded that disability culture — community, solidarity, creativity — directly informed design decisions in ways that produced different and often more effective technologies than those designed by non-disabled teams.

Several papers apply frameworks from disability studies — crip technoscience, disability justice, the social model of disability — as analytical tools within accessibility research. A 2024 review of a decade of captioning research (2013-2023) found that over 90% of captioning studies targeted technical improvements — ASR accuracy, display design, latency — while only a small fraction addressed the social conditions that make communication inaccessible, such as hearing people's unwillingness to modify their speech or the stigma of requesting captions. Most research, the authors observed, positions the deaf or hard-of-hearing individual as the sole agent of access, rarely engaging hearing conversation partners as co-responsible for making communication work.

## Accessibility Research Is Increasingly Studied Outside Western Contexts

Research conducted in Kenya, India, and Ghana is documenting accessibility experiences that differ from those studied in higher-income settings.

A longitudinal study of 193 participants in Kenya (2025) — described by its authors as the first of its kind — found that smartphones serve as transformative assistive technology where specialised AT is unavailable. Live Transcribe enabled DHH participants to attend meetings without interpreters, and TalkBack-enabled participation in family WhatsApp groups reduced social isolation. Quantitative analysis showed significant improvements in 39 of 55 smartphone competence measures following training. But the study also identified context-specific barriers: Live Transcribe struggled with Kenyan English accents and Kiswahili; M-Pesa mobile payment interfaces presented accessibility challenges critical for financial independence; and a 72% smartphone ownership gap between disabled and non-disabled populations was driven largely by affordability.

Research from India (2025) found that teachers with vision impairments saw clear applications for generative AI in curriculum design and teaching, but most lacked reliable internet, had limited AI exposure, and worked in institutional contexts where adoption support was minimal. A study on digital literacy training for disabled people in low- and middle-income countries (2024) found that training must be embedded in local priorities — employment, social connection, financial services — rather than treating digital literacy as an abstract competency.

## Intersecting Identities Are Complicating the Picture

Several studies examine how disability intersects with race, gender, sexuality, and migration status in ways that shape access.

A 2023 paper, "Working at the Intersection of Race, Disability and Accessibility," reported that a 2020 search of the ACM digital library for papers combining "race," "disability," and "accessibility" returned almost no relevant results. The paper argues that accessibility research has overwhelmingly centred the experiences of white, well-off, educated people with disabilities. A 2022 meta-analysis of 190 accessibility datasets spanning 1984-2021 found that gender representation skewed 60.1% toward men and boys, and that race and ethnicity data was absent from 84.2% of datasets — making it impossible to assess whether research findings generalise across racial groups.

A 2022 study of refugees with disabilities in the US found that socio-cultural barriers — language, stigma, lack of cultural competency — were often more significant than technical accessibility barriers. A 2023 study of LGBTQIA+ individuals with disabilities found that social stigma actively discouraged assistive technology use in community centres — participants reported deliberately not using hearing aids to avoid standing out, even when this meant missing activities. A 2024 paper on intersectional, neurodivergent lived experiences argued that accessibility research has treated disability as a single axis of identity, failing to account for how race, gender, class, and neurodivergence compound to produce distinct experiences of exclusion.

## Workplace Accessibility Goes Beyond Compliance

Research on workplace accessibility is addressing questions that go beyond whether individual tools meet standards.

A study of blind and low-vision workers using digital collaboration tools (2025) found that while Slack, Teams, and Google Docs were individually accessible, the workflows connecting them created compound barriers. Switching between platforms, tracking simultaneous conversations, and managing notification overload produced difficulties that no single tool's accessibility features could address. The paper distinguishes between "accessibility" (can you use this tool?) and "ease of use" (can you do your job effectively with this tool?).

Research on neurodivergence disclosure in software workplaces (2025) found that disclosure decisions were shaped by fear of career consequences, perceived "tech bro" culture, and whether workplaces offered concrete accommodations or merely performative acceptance. A 2025 study examined how onboarding processes break down when mandatory documents and workflows are themselves inaccessible.

A 2020 study of hands-free sign language interpreting highlighted a workplace equity issue that technical accessibility cannot solve alone: hearing workers can walk, talk, and multitask simultaneously, while DHH workers using video remote interpreting are physically tethered to their devices. The prototype enabled natural two-handed signing and free movement, and hearing participants reported stronger personal connection because the interpreter became "invisible" — they could make direct eye contact with the DHH person.

## Extended Reality Is Being Made Accessible — and Revealing New Barriers

Research on virtual reality, augmented reality, and extended reality accessibility addresses populations including blind and low-vision users, deaf and hard-of-hearing users, people with motor impairments, and neurodivergent people.

For blind users, researchers have built touch-based "scene reading" interfaces that extend familiar screen reader paradigms into 3D environments (2025), and accessible VR boxing games that achieved moderate-to-vigorous physical activity thresholds — significant because 53% of blind and low-vision people identify as physically inactive compared to 27% of the general population, according to the paper's cited statistics.

For DHH users, a sound modification toolkit (2024) challenged the prevailing approach of substituting audio with visual or haptic alternatives. Its authors argued that deafness occurs on a spectrum, and many DHH people benefit more from controlling audio itself — boosting speech, reducing background noise, shifting frequencies — than from replacing it. Users valued this control, and several noted that hearing users might also benefit, reinforcing the curb-cut effect.

A 2020 study — described by its authors as the first in-depth investigation of VR accessibility for motor impairments — documented seven physical barriers, from setup to controller manipulation. One participant's summary: "I just went into it assuming that I wouldn't be able to have the full experience." A 2025 study provided what its authors describe as the first empirical data on freehand gesture accessibility, finding that pinching — the most common gesture across Meta Quest, Apple Vision Pro, and Microsoft HoloLens — caused median pain scores of 1.50 for participants with motor impairments versus 0.00 for controls.

Research on disability identity in social VR found that when participants used inclusive avatars for a week, nine of ten wanted to continue despite six of ten experiencing ableist harassment. Participants with invisible disabilities described avatar-based disclosure as liberating — a way to represent their condition on their own terms.

## The Research Itself Identifies Significant Gaps

Perhaps the most useful contribution of recent accessibility scholarship is its willingness to examine its own blind spots. Several papers have conducted systematic reviews that document what is missing.

**Multiple disabilities.** A survey of 836 papers published at ASSETS and CHI from 1994 to 2019 found that only 7% focused on multiple disability communities and just 1% focused on users with multiple disabilities. The authors call this "starkly out of proportion with reality" — a UK survey found that nearly 75% of disabled people live with more than one impairment, and over 51% of those with three or more impairments reported that current assistive technologies do not adequately address their needs.

**Cerebral visual impairment.** A scoping review of 110 vision-based assistive technology papers found that virtually none addressed CVI specifically, despite it being the leading cause of childhood visual impairment in developed countries. The authors note that standard accommodations like magnification may be counterproductive for CVI because the problem is neurological, not optical.

**Race in accessibility data.** A meta-analysis of 190 accessibility datasets found race and ethnicity data absent from 84.2% of datasets. A separate paper found almost no published work combining race, disability, and accessibility.

**Privacy in assistive technology.** An analysis of 18 assistive technology privacy policies (2024) found that none included protections specific to individuals with disabilities — despite these being technologies designed explicitly for disabled users. People with disabilities face nearly double the lifetime risk of intimate partner violence, the authors note, making data privacy protections especially critical.

**Communication as social practice.** A decade-long review of captioning research found that over 90% targeted technical infrastructure, while research rarely engaged hearing people as co-responsible for accessible communication.

These self-identified gaps are arguably as valuable as the positive findings. They describe not just what researchers have studied, but what they recognise still needs attention.

## What This Means for Practice

Taken together, this body of research suggests several considerations for accessibility practitioners.

Generative AI is being applied across every area of accessibility, but the research documents both genuine utility and specific failures — overconfident outputs, homogenisation of personalised tools, misalignment with disabled users' values, and reproduction of stereotypes. The finding that showing blind users multiple AI descriptions of the same image increased unreliable claim detection by nearly fivefold suggests that single AI outputs should not be treated as authoritative.

Accessibility is being studied as encompassing cognitive, emotional, and social dimensions — not just sensory and motor interaction. Research on ADHD, autism, and neurodiversity demonstrates that executive function, emotional regulation, sensory processing, and social communication are all areas where technology creates barriers and opportunities.

Context matters at every level — geographic, cultural, organisational, and intersectional. The same technology that transforms access in Nairobi may be inaccessible in rural India. The same tool that is technically accessible may be practically unusable within a particular workflow. The same disability is experienced differently depending on race, gender, and economic circumstances.

Customisation is consistently valued across populations and technologies. Whether the subject is sound masking for autistic noise sensitivity, vision enhancement for low vision, VR locomotion, or avatar-based disability disclosure, users want to configure tools to their individual needs. The research repeatedly shows that clinical diagnosis is a poor predictor of individual preference.

And the distinction between designing *for* disabled people and designing *with* or *by* disabled people continues to produce different kinds of knowledge and different kinds of technology. Autoethnographic research identifies gaps — like the difference between technical sufficiency and experiential adequacy — that evaluation metrics alone may not reveal. Technologies created by disabled innovators reflect values and priorities that emerge from lived experience rather than external problem identification.

---

*This article draws on 584 literature reviews from A11y Paradise (a11ybob.com). All research cited was published at ACM conferences and venues between 2020 and 2025.*
