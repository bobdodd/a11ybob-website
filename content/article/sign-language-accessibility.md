---
title: 'Sign Language and Technology: Advances, Tensions, and the Question of Who Benefits'
publishedAt: '2026-05-06'
tags: []
---

# Sign Language and Technology: Advances, Tensions, and the Question of Who Benefits

## Research on sign language accessibility reveals a field where impressive technical progress coexists with fundamental questions about privacy, community authority, and whether the technology serves deaf people or merely studies them

Sign languages are complete natural languages with their own grammars, spatial structures, and cultural traditions. They are not simplified versions of spoken languages, not mime, and not universal — American Sign Language differs from British Sign Language as much as English differs from Japanese. Over 70 million people worldwide use sign languages as their primary means of communication.

Technology's relationship with sign language is complicated. Advances in computer vision, machine learning, and real-time processing are making sign language recognition, translation, and education increasingly feasible. But the same research that builds these tools also raises difficult questions: Who controls the data? Who decides what counts as "good enough" recognition? Who benefits from translation systems — the deaf signer, or the hearing person who does not want to learn to sign?

This article examines what researchers have found across 74 peer-reviewed papers on sign language and deaf communication accessibility. The work reveals both genuine technical progress and persistent tensions that the field is only beginning to address.

## Recognition and Translation Are Advancing — With Caveats

Sign language recognition technology has progressed substantially. Ahmed [2025] presented SignStreamNet, achieving near real-time sign-to-text translation with BLEU-1 scores of 76.6 on the Greek Sign Language dataset — a new state of the art for streaming translation. The streaming capability matters: previous models required the full video before producing any output, making them impractical for live communication. SignStreamNet processes incoming video incrementally, producing partial translations as signing continues — but at a cost of roughly 6.5 BLEU points compared to offline models that can see the entire video.

Zhou et al. [2020] built a portable Hong Kong Sign Language translation platform combining a mobile app with an NVIDIA Jetson Nano edge device, achieving 93.3% accuracy on a 45-word vocabulary with 5.82 seconds total translation time. The edge computing approach was deliberate: users do not need to upload sensitive video data to the cloud. But a 45-word vocabulary is extremely small for real-world communication, and the 5.82-second delay is too slow for fluid conversation.

Kezar et al. [2023] introduced the Sem-Lex Benchmark — over 84,000 sign videos from 41 deaf ASL signers, all of whom gave informed consent. A critical contribution was demonstrating that incorporating phonological features (the linguistic building blocks of signs, analogous to phonemes in spoken language) improved recognition accuracy from 67.7% to 71.3%. This finding — that linguistic knowledge about how signs are structured improves ML models — challenges the common approach of treating sign recognition as a pure computer vision problem detached from linguistics.

Aldahir and Grau [2024] built a BSL fingerspelling recogniser using commodity hardware (a standard webcam) and transfer learning. A complete novice improved from 45% to 70% accuracy after 30 minutes of practice with real-time feedback — approaching the expert signer's consistent 73-76% score. The approach demonstrates that affordable, self-paced learning tools are feasible.

Monteiro et al. [2019] addressed the problem of finding sign language content on video platforms. Metadata-based search yielded only 43% precision because tags are inconsistent and incomplete. Their visual content-based approach — detecting sign language through motion patterns around detected faces — achieved 83% precision while reducing computation time by 96%, enabling practical search at platform scale.

## Privacy Is Not a Side Issue

Sign language is visual. To sign, you show your face, your body, your surroundings. To collect sign language data for training ML models, you collect video of identifiable people performing an intimate form of communication. This creates privacy tensions that spoken language data collection does not face.

Bragg et al. [2020] studied these tensions directly and found that 93% of deaf participants reported concerns about contributing sign language videos for research. The most common concern was video misuse (61%), followed by being recognised (39%) and revealing surroundings (36%). Willingness to contribute varied dramatically by data recipient: 90% would contribute to a company, 89% to a university, but only 36% to the public. Visual filters shifted these numbers — frame cel shading maintained similar contribution rates to private entities while boosting public willingness. But the most important finding was a privacy-participation-performance trade-off: filters that effectively anonymised signers also degraded the very visual features ML models rely on, particularly facial expressions that carry grammatical information in sign languages.

Lee et al. [2021] investigated ASL video anonymisation and found a three-way trade-off among understandability, naturalness, and anonymity. With-torso videos were most understandable (81% strongly agreed) but provided weak anonymity — 9 of 16 participants correctly identified the male signer from a photo lineup despite face transformation. Without-torso videos offered the strongest anonymity (88% agreed identity was disguised) but were less natural because viewers could not see the signer's body language. As one participant noted: signing without torso "doesn't feel like real signing."

These are not merely technical challenges. They reflect the Deaf community's historical experience of audism — discrimination based on the ability to hear — and the vulnerability of a small, identifiable community to exploitation. Bragg et al. [2020] note that some existing ASL datasets were scraped from the internet without consent, a practice the Deaf community views as extractive and disrespectful.

## Who Decides What Sign Language Technology Should Do?

The question of community authority runs through the research.

Kamikubo et al. [2025] investigated the disconnect between ML practitioners and Deaf ASL signers and found alarming gaps. Among ML practitioners surveyed, 51% considered "hearing impaired" appropriate terminology — a term rejected by the Deaf community. Seventy-four percent incorrectly identified ASL as universal. Many with sign language processing experience had never collaborated with a Deaf signer. ASL signers, for their part, identified communication access as their biggest barrier to collaboration: limited interpretation services, inconsistent quality, and reliance on text-based communication that loses nuance.

The paper proposes a collaboration framework built on mutual education, linguist-mediated translation of concepts between ML and Deaf epistemologies, and community-controlled data governance. At the collaborative workshop, hearing ML practitioners reported increased awareness of Deaf culture and linguistic richness, while Deaf signers gained understanding of ML workflows — suggesting the gap is bridgeable but requires deliberate effort.

Kafle et al. [2020] raised a related concern from years of building AI systems for DHH users: the danger that cost-saving decision-makers will deploy imperfect AI captioning to replace human interpreters and captionists prematurely. They recount that the World Federation of the Deaf and World Association of Sign Language Interpreters issued a joint statement in 2018 cautioning against premature deployment of sign language avatar technology. The paper also found that Word Error Rate — the standard metric for evaluating automatic speech recognition — correlated poorly with DHH users' actual comprehension and satisfaction with captions. Standard metrics optimise for the wrong thing.

Kacorri et al. [2017] demonstrated this measurement problem empirically: when deaf participants evaluated sign language animations, participant characteristics — schooling background, home ASL use, technology attitudes — explained more variance in evaluation scores than the actual quality of the animation being tested. The finding means that studies with different participant pools cannot be meaningfully compared without reporting and controlling for these factors.

## Sign Language Avatars: Promise and Resistance

Sign language avatars — computer-animated figures that produce sign language from text or script input — represent a contentious technology. They could, in principle, make sign language content infinitely scalable: rather than recording a human signer for every piece of content, a system could generate signing on demand.

Al-khazraji et al. [2021] investigated whether DHH users actually prefer avatar signing that replicates human timing, or whether adjustments improve clarity. They found that participants preferred faster sign durations (0.81 seconds versus the human-typical 1.28 seconds) and slower transitions between signs (0.5 seconds versus 0.23 seconds). The preference for faster signs with slower transitions may help viewers distinguish when a sign is being performed versus when the avatar is transitioning — a distinction more important for animated signers than human ones, where the transition is naturally fluid.

But community resistance to avatars is well-documented. The 2018 joint statement from the World Federation of the Deaf cautioned against deploying avatar technology prematurely [Kafle et al., 2020]. The concern is not just quality — it is that avatars may be deployed as cheap substitutes for human interpreters, reducing the already scarce interpreting workforce while providing an inferior experience that hearing decision-makers deem "good enough."

## Information Access in Sign Language

For many deaf individuals, written English (or the written form of whatever spoken language surrounds them) is a second language acquired with varying degrees of fluency. This creates information access barriers that go beyond what captions or subtitles can solve.

Glasser et al. [2022] built ASL Wiki, a bilingual interface for crowdsourcing English-to-ASL translations of text articles. All 19 deaf participants agreed it was helpful to view content in both English and ASL. But a gap emerged between consuming and producing translations — participants were enthusiastic about reading ASL content but more hesitant about recording their own signing, citing self-consciousness, perfectionism, and privacy concerns.

Boll et al. [2023] designed SL-Surveys, an interactive survey tool built from the ground up for ASL rather than retrofitting text-based platforms with video. Six of seven deaf participants intuitively grasped the interface without instructions. Freeze frames — static images showing a sign at a recognisable moment — emerged as a powerful innovation: participants used them to scan, identify, and select answer choices without watching full videos for familiar signs.

Boll et al. [2020] addressed a more fundamental methodological gap: survey and questionnaire platforms are designed for written languages, creating barriers for ASL-signing deaf individuals. Their recommendations for ASL-accessible research instruments include depicting all contributors in the video, considering that ASL's spatial-visual nature requires different question layouts, and acknowledging that the signer in a video is perceived differently from an invisible text author.

Seita et al. [2025] built a bilingual informed consent form navigable simultaneously in ASL and written English. Healthcare professionals rated its usability as "truly superior" (SUS 91.25), and 93.75% said having the form would make them more comfortable including DHH participants in research. But only 12.5-42.9% of researchers had ever included DHH sign language users, and only 14-19% always had funding for accessibility accommodations — revealing systemic barriers beyond technology.

## Sign Language Learning Technology

Over 90% of deaf children are born to hearing families, and the research documents both the urgency of family sign language acquisition and the inadequacy of current tools.

Liu et al. [2025] developed CoSignPlay, a collaborative approach to learning non-manual signs — facial expressions, head movements, and body posture that serve lexical, morphological, and syntactic functions in ASL. The system lets two players jointly control a 3D avatar, one handling facial expressions while the other performs manual signs. The design is grounded in Deaf community practice: "group narrative," a collaborative storytelling activity. Key challenges participants identified included the cognitive difficulty of shifting from sequential spoken language to simultaneous visual language, and cultural embarrassment around exaggerated facial expressions — particularly across different cultural backgrounds and gender norms.

Ritmeester et al. [2024] found that existing sign language learning resources focused overwhelmingly on individual signs rather than sentence construction. Parents valued learning at home during spare moments — while cooking, before bedtime — rather than only in scheduled classes.

Hassan et al. [2022] built an in-context dictionary lookup for ASL video that produced significantly higher translation accuracy (8.03 versus 6.67 out of 10, p=0.0424) and lower cognitive workload than external dictionary tools. Hassan et al. [2025] extended this to a video-based ASL dictionary where learners look up unfamiliar signs by recording themselves performing the sign — addressing a fundamental problem where encountering an unknown sign in video provides no way to search for it using text.

Quandt et al. [2020] presented SAIL, the first ASL instructional system for immersive VR, built by a majority-Deaf team at Gallaudet University. The system uses motion capture from a native Deaf signer to create avatar demonstrations, and LEAP Motion to track learners' hand movements. Participants wanted more time between signs and requested corrective feedback on their own signing.

Huenerfauth et al. [2017] investigated video-based feedback for ASL learners and found that students who received any form of feedback demonstrated significantly greater signing improvement than those who only watched their video (p = 0.0008). Time-synchronized popup annotations produced the highest student satisfaction.

Brashear [2007] documented one of the earliest challenges that remains relevant: building sign recognition for children's natural signing, where the majority of samples fell into a "game correct but unclear" category — conversationally correct but containing disfluencies and non-standard forms not present in scripted lab datasets.

## Deaf Communication Beyond Sign Language

The research addresses deaf communication needs that extend beyond sign language itself.

Berke et al. [2020] built Chat in the Hat, a hands-free remote interpreting prototype using a hat-mounted camera and smart glasses. The system achieved 96% sign intelligibility in the glasses display and enabled natural two-handed signing and free movement. Hearing participants reported a heightened sense of personal connection because the interpreter became "invisible" — they could make direct eye contact with the DHH person. But this invisibility created a paradox: as the interaction felt more natural, delays from interpretation became more jarring.

Mathew and Dannels [2025] studied sign language interpreters' user experience in remote settings and found that wider field-of-view webcams significantly improved interpreter satisfaction. Traditional platforms limit interpreters to a narrow view of the deaf client, missing contextual cues from the broader meeting environment. The OBSBOT Tiny webcam with automatic gesture-based body tracking was rated most effective, providing the rich visual context interpreters need.

Mathew et al. [2022] evaluated Access on Demand, AR smart glasses delivering real-time captioning and ASL interpretation. The most significant benefit was "glanceability" — viewing captions while maintaining eye contact with the speaker. But battery life was about one hour, the glasses generated noticeable heat, and one-handed signing was required because the other hand held a phone — effectively preventing two-way communication.

Anant et al. [2023] built Jod, a videoconferencing platform for mixed hearing groups. DHH participants allocated the interpreter's video tile nearly twice the visual space (59.7%) compared to hearing participants (33.7%), and frequently minimised hearing participants' tiles entirely. The finding that DHH users need fundamentally different visual layouts — not just captions added to standard designs — challenges the incremental accessibility approach taken by mainstream platforms.

## Sound Accessibility for DHH Users in Virtual Reality

Research on VR sound accessibility has produced systems that go beyond substituting audio with captions.

Li et al. [2022] built SoundVizVR, a Unity plugin visualising sound information through on-object indicators and mini-maps. The full mini-map with on-object indicators achieved 94.70% sound localisation accuracy versus 24.24% with no visualisation.

Cao and Jain [2024] challenged the prevailing approach of replacing audio entirely, arguing that deafness occurs on a spectrum and many DHH people benefit from controlling audio itself. Their 18 sound modification tools allowed users to boost speech while reducing background noise, shift frequencies into audible ranges, and add spatial indicators — with several participants noting that hearing users might also benefit.

Chelladurai et al. [2024] developed head-based haptic feedback converting spatial audio to vibrotactile feedback, finding that five transducers with frequency equalisation provided effective directional sound information. Anderton [2022] tested sign language interpreter rendering in VR 360-degree content, finding that fixed-position rendering produced higher presence but more content blocking, and that arrow guides were dramatically more usable than radar minimaps (SUS 92.8 versus 63.1).

## Captioning as Collective Responsibility

McDonnell and Findlater [2024] reviewed a decade of captioning research and found over 90% targeted technical infrastructure while only a small fraction addressed the social conditions that make communication inaccessible — hearing people's unwillingness to modify their speech, the stigma of requesting captions, or environments where background noise is not managed.

Wu et al. [2025] built CARTGPT, combining human CART captioning with GPT-4 to achieve 89.0% word accuracy — a 5.6% improvement over standard CART, most pronounced for technical content. Huang et al. [2025] developed CapTune for customising non-speech captions, where 9 of 12 DHH viewers reported that customisation deepened their emotional connection to content.

Seita et al. [2025] designed notifications prompting hearing speakers to adjust their behaviour during captioned videoconferences. Seita et al. [2021] provided the first quantitative evidence that medium enunciation — not over-enunciation, which is perceived as condescending — and dynamic intonation produce the highest DHH satisfaction.

Loizides et al. [2020] documented how Google's Live Transcribe was adopted in ways beyond its design intent: a deaf usher communicating with hearing sports attendees, hearing colleagues installing the app on their own phones when a deaf coworker's phone broke. These instances illustrate a shift in who bears the burden of communication access.

## Deaf Culture, Identity, and Research Practice

Unger et al. [2021] described the challenges hearing researchers face conducting research with sign language users: all preparation materials must be available in sign language, attention management differs in sign language conversations (no "let me just interrupt you"), and sign language fluency within the research team is essential — not just at the data collection stage.

Cavdir et al. [2025] documented 15 months of technology-mediated music performance by a mixed-hearing team at CymaSpace, a Deaf-owned music institution. They define "sonic agency" as the right to shape sound regardless of whether one can hear it, and advocated for prioritising Deaf-composed music to centre Deaf creative agency rather than treating Deaf musicians as additions to hearing ensembles.

Berke et al. [2019] produced the first psychometrically validated ASL translations of the System Usability Scale and Net Promoter Score, noting that no standardised usability instruments had previously existed in ASL — effectively excluding deaf signers from rigorous HCI research and commercial usability testing.

Tran et al. [2015] discovered that intelligible ASL video communication requires only 25% of the ITU-T recommended bandwidth (10fps at 60kbps versus the standard 25fps at 100kbps), with implications for reducing data costs and enabling communication in low-bandwidth environments.

## What the Research Reveals

Across recognition, translation, privacy, education, interpreting, and cultural production, several findings recur.

**Technical progress is real but insufficient.** Recognition accuracy is improving, streaming translation is becoming feasible [Ahmed, 2025], and linguistic knowledge demonstrably improves ML models [Kezar et al., 2023]. But vocabularies remain small, real-time delays persist, and the gap between controlled benchmark performance and messy real-world signing remains substantial [Brashear, 2007; Zhou et al., 2020].

**Privacy and trust are foundational.** Ninety-three percent of deaf participants expressed concerns about contributing sign language data [Bragg et al., 2020]. Anonymisation degrades the very features models need [Lee et al., 2021]. Datasets scraped without consent are ethically compromised and linguistically weaker [Kezar et al., 2023]. Trust must be built through community governance, informed consent, and transparent data practices — not assumed.

**The Deaf community's authority matters.** When 74% of ML practitioners incorrectly believe ASL is universal and 51% use terminology the community rejects [Kamikubo et al., 2025], the disconnect between who builds the technology and who it claims to serve is clear. The most successful projects — SAIL built by a majority-Deaf team at Gallaudet [Quandt et al., 2020], Sem-Lex with consenting Deaf signers [Kezar et al., 2023], CymaSpace technologies designed by DHH musicians [Cavdir et al., 2025] — involve Deaf people as creators, not just subjects.

**Standard metrics do not capture what matters.** Word Error Rate correlates poorly with DHH comprehension [Kafle et al., 2020]. Participant characteristics explain more evaluation variance than animation quality [Kacorri et al., 2017]. Studies that evaluate sign language technology without reporting participant demographics cannot be meaningfully compared.

**The one-directional bias persists.** Most sign language translation research translates from sign to text or speech — serving the hearing person who encounters a signer. Far less work translates from text or speech to sign — which would serve the deaf person navigating a hearing world. The direction of translation reveals who the technology is designed to benefit.

---

*This article draws on 74 peer-reviewed papers reviewed at A11y Paradise (a11ybob.com). All research cited was published at ACM conferences and venues between 2007 and 2025.*
