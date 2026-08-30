---
title: 'Beyond Speech: What Research Reveals About Augmentative, Alternative, and Accessible Communication'
publishedAt: '2026-05-06'
tags: []
---

# Beyond Speech: What Research Reveals About Augmentative, Alternative, and Accessible Communication

## AAC research is moving past the speech-generating device toward a richer understanding of how communication actually works — and what technology misses when it focuses only on words

Communication is not just speech. It is also gesture, gaze, posture, timing, backchanneling, turn-taking, facial expression, shared context, and the social dynamics that determine who gets to speak and who is heard. Yet the technologies designed to support people with communication disabilities have historically focused on one thing: generating words. The result, as a systematic review of 43 years of AAC research concludes, is that 92.3% of high-tech AAC supports only verbal communication, and 87.4% uses a linear model where the user constructs a message one direction at a time [Curtis et al., 2022].

This article examines what researchers have found across 81 peer-reviewed papers on augmentative, alternative, and accessible communication published between 2007 and 2025. The work spans AAC devices, sign language technology, speech recognition for atypical speech, captioning, voice interfaces, and the social dimensions of communication that technology often ignores. The most consistent finding: the field is beginning to understand that accessible communication is not just about producing words — it is about participating in conversation.

## The State of High-Tech AAC

Curtis et al. [2022] produced the first systematic review and taxonomy of high-tech AAC within the ACM literature, analysing 562 articles spanning 1978-2021. Their findings describe a field with significant blind spots. Mechanical and tactile inputs dominate (38.4% and 32.7%), while camera-based, gestural, and contextual inputs remain underexplored. Audio output accounts for 62.8% of systems. Only 1.4% of research explores non-verbal communication and just 1.4% supports transactional communication models (interactive, bidirectional exchange). Randomised controlled trials are almost entirely absent, meaning the evidence base for AAC effectiveness remains thin.

The 67% abandonment rate for AAC devices reported by Albar [2020] — driven by vocabulary that does not match users' daily needs and high maintenance burden — suggests a fundamental misalignment between what AAC systems offer and what users require. Albar proposes context-aware AAC that adapts vocabulary based on location, time, and activity, noting that few existing systems support unplanned communication.

## The Nonverbal Dimension

Two papers directly challenge the word-centric focus of AAC.

Valencia et al. [2021] co-designed a physical expressive "sidekick" device with Mark, who has cerebral palsy and uses a head-switch-operated AAC device. AAC systems enable speech generation but do not support the nonverbal aspects of conversation — signalling a desire to take a turn, indicating that a message is being composed, or calling for attention. Mark's sidekick used coloured lights and sounds to convey these functions. Over a three-week field study, conversation partners noticed the sidekick every time it was used, and Mark described it as "fantastic in real-time with real people." But he noted it was less effective in online meetings where camera framing could cut it off, and in large groups where the subtle signals were lost.

Weinberg et al. [2025] investigated backchanneling — the "uh-huh," nods, and facial expressions that listeners use to show engagement without taking a full speaking turn. Backchanneling constitutes approximately 19% of spoken dialogue, yet AAC technology creates significant barriers to it: users must visually attend to their devices, making it harder to observe conversational partners and produce timely feedback. The study found that AAC users develop a unique "micro-culture" of communication, blending device output with embodied signals like eyebrow raises, chair movements, and vocalizations — strategies that operate in parallel to device use. In AAC-to-AAC conversations, both users looked down at their devices simultaneously, leading to near-complete loss of eye contact and missed backchannel signals from both sides.

## Moving Beyond Screens

Recent research questions whether AAC needs to be a tablet at all.

Curtis and Neate [2023] co-designed smartwatch AAC applications with people living with aphasia and found that the watch form factor offered advantages that tablets cannot: discretion (it does not signal disability to bystanders), portability (always worn, never forgotten), and critically, it does not occupy the hands, leaving them free for the gestural communication that people with aphasia already use naturally. One application, Watch Out, provided eight key expressions for on-the-go situations; another, Watch In, offered conversation transcription, a phoneme-based word-finding dictionary, and haptic breathing exercises for anxiety. Participants rated both applications highly but — revealingly — wanted the watch to augment their existing communication strategies rather than replace them.

Curtis et al. [2024] went further, co-designing mixed reality and discreet AAC devices with people with aphasia. Three prototypes spanned a spectrum: Prompt AAC (an iOS app paired with earphones using Apple's Personal Voice for discreet speech backup), Pico-project AAC (a smartphone with a pico projector for projecting communication props onto surfaces), and Holo AAC (a Microsoft HoloLens 2 application). Prompt AAC received the highest ratings, valued for its discreetness and the authentic sound of Personal Voice synthesis. Participants wanted AAC devices that reflected personal style and fashion identity rather than medicalised aesthetics. The HoloLens, despite generating the most excitement, was criticised for gesture interactions inaccessible to people with hemiplegia, cognitive overload from visual clutter, and the antisocial aesthetics of current headsets.

## DIY AAC and What It Teaches Us

Curtis et al. [2025] studied Zuzenna, a stroke survivor with aphasia, and her self-made communication diary — a physical notebook combining art, handwritten notes, photographs, and collaged materials that she developed organically over months. Against a backdrop of widespread AAC abandonment, the researchers studied this bottom-up, evolving tool rather than designing a new top-down intervention. The diary functioned as a temporal anchor controlling conversational pacing, a repository of sharable memories that sparked serendipitous conversations, and an ecosystem incorporating smartphones and handwritten notes alongside the physical book. Zuzenna described commercial AAC devices as feeling like they belonged to a speech therapist, not to her. The diary, by contrast, was deeply personal — its imperfections were features, not bugs.

Bircanin et al. [2020] documented TalkingBox, a tangible communication device co-designed with Chris, a young adult with severe cognitive disability who was minimally verbal. Over a seven-week field study, the device — which paired physical objects with audio output — produced outcomes beyond its intended purpose: it became a personalised memory game, an unanticipated social catalyst attracting other adults at Chris's day centre, and a tool that revealed capabilities that staff had not previously observed. The paper argues for a strengths-based approach where technology reveals capabilities rather than fixing deficits.

## Sign Language: Recognition, Translation, and Community

Sign language technology occupies a distinctive position in communication accessibility — it involves a complete natural language with its own grammar and spatial structure, serving communities with strong cultural identity and legitimate concerns about how technology represents them.

Kamikubo et al. [2025] investigated the disconnect between machine learning practitioners and the Deaf community and found alarming gaps. Among ML practitioners surveyed, 51% considered "hearing impaired" appropriate terminology (it is rejected by the Deaf community), 74% incorrectly identified ASL as universal, and many with sign language processing experience had never collaborated with a Deaf signer. The paper proposes a collaboration framework built on mutual education, linguist-mediated translation of concepts between ML and Deaf epistemologies, and community-controlled data governance.

Kezar et al. [2023] introduced the Sem-Lex Benchmark, containing over 84,000 sign videos from 41 deaf ASL signers — all of whom gave informed consent, in contrast to some existing datasets scraped from the internet without permission. Incorporating phonological features (the linguistic building blocks of signs) improved recognition accuracy from 67.7% to 71.3%, demonstrating that linguistic knowledge enhances rather than complicates ML models.

Ahmed [2025] presented SignStreamNet, achieving near real-time sign-to-text translation with BLEU-1 scores of 76.6 on the GSL dataset — a new state of the art for streaming translation. The streaming capability is the key differentiator: previous models required the full video before producing output, making them impractical for live communication.

Hassan et al. [2025] built a video-based ASL dictionary where learners look up unfamiliar signs by recording themselves performing the sign via webcam — addressing a fundamental problem where encountering an unknown sign in video content provides no way to search for it using traditional text-based dictionaries.

Bragg et al. [2020] tackled the tension between the need for training data and the privacy risks of collecting video from a small, identifiable community. Among participants, 93% reported privacy concerns about contributing sign language videos. Frame cel shading — a visual filter — maintained similar contribution rates to private entities while boosting willingness to contribute publicly.

## Captioning as Social Practice

Research on captioning reveals that the technical quality of captions is only part of the picture.

McDonnell and Findlater [2024] reviewed a decade of captioning research and found over 90% targeted technical infrastructure while only a small fraction addressed the social conditions that make communication inaccessible. Most research positions the DHH individual as the sole agent of access, rarely engaging hearing conversation partners.

Seita et al. [2025] designed notification systems that prompt hearing speakers to adjust their behaviour during captioned videoconferences — speaking slower, louder, or more clearly. DHH participants preferred subtle icon-based notifications that maintained conversation flow, while hearing participants preferred more prominent pop-ups that were harder to miss. The central insight: technology that shifts the burden of communication access from DHH individuals to hearing partners addresses a fundamental power imbalance.

Seita et al. [2021] provided the first quantitative evidence of DHH preferences for hearing speakers' behaviour during technology-mediated communication. Medium enunciation was preferred — under-enunciation was hard to understand, while over-enunciation was perceived as rude or condescending. Dynamic intonation was preferred over monotone delivery.

Wu et al. [2025] developed CARTGPT, achieving 89.0% word accuracy compared to 83.4% for standard CART — a 5.6% improvement most pronounced for technical content. Loizides et al. [2020] documented how Google's Live Transcribe was adopted in ways beyond its design intent: a deaf usher communicating with hearing sports attendees, two deaf travellers helping a lost hearing woman, and hearing colleagues installing the app on their own phones when a deaf coworker's phone broke — distributing the accessibility burden across the group.

## Speech Recognition for Atypical Speech

Voice interfaces assume typical speech, systematically excluding people whose speech differs.

Takashima et al. [2024] demonstrated that self-supervised pre-training on unlabeled disordered speech data, followed by supervised fine-tuning on a small amount of labeled data, reduced phoneme error rates for speakers with motor speech disorders from 30-73% (baseline) to 4-13% — approaching the 2-3% achieved for typical speech.

Bleakley et al. [2022] deployed smart speakers in the homes of 11 people who stammer for three weeks and found that the presence of other people increased stammering during interactions, specific sounds and letters triggered difficulties, and devices interpreted stammered speech as background noise or partial commands. Participants developed compensatory strategies — rehearsing phrases, choosing alternative wake words, speaking during quiet moments — but these added cognitive load. The wake word "Hey Google" was problematic because the plosive "g" is a common stammer trigger.

Ghai and Mueller [2021] built Fluent, a writing tool that helps people who stutter prepare scripts by automatically suggesting alternative words that are easier to pronounce. The system uses phonetic embeddings to identify trigger words and active learning to personalise to individual stutter patterns, achieving over 80% accuracy within just 20 interactions.

## Sign Language Learning for Hearing Families

Over 90% of deaf children are born to hearing families, and the research documents both the urgency and the difficulty of bridging this communication gap.

Liu et al. [2025] developed CoSignPlay, a collaborative approach to learning non-manual signs in ASL. The system lets two players jointly control a 3D avatar — one handling facial expressions, the other performing manual signs — reducing the cognitive load of learning visual-spatial language. The design is grounded in Deaf community practice: "group narrative," a collaborative storytelling activity.

Ritmeester et al. [2024] studied ZINinNGT, a mobile app for hearing parents learning Dutch Sign Language, and found that existing resources focused overwhelmingly on individual signs rather than sentence construction. Parents valued the ability to practise at home during spare moments — while cooking, before bedtime — rather than only in scheduled classes.

Quandt et al. [2020] presented SAIL, the first ASL instructional system for immersive VR, built by a majority-Deaf team at Gallaudet University using motion capture from a native Deaf signer. Preliminary testing found that participants requested more time between signs and corrective feedback on their own signing.

## Communication in Aphasia

Aphasia — a language disorder typically caused by stroke affecting speech, reading, writing, and comprehension — receives increasing research attention.

Tamburro et al. [2020] built Comic Spin, a tablet app enabling people with aphasia to create comic strips through constrained creativity: limiting choices to support rather than overwhelm users. Eight participants produced 24 comics in approximately 18 minutes.

Nevsky et al. [2024] conducted the first study of media accessibility interventions for people with aphasia and found that participants wanted content "domesticated" — translated into aphasia-friendly versions at the point of production. One participant captured this: "The camera must stand still, it does not matter what way we... the front, the back, the everything, but it just stands still." The social dimension of viewing was critical: participants stressed shared viewing with partners who could pause, rewind, and discuss.

Yolanda et al. [2023] tested audio-based ecological momentary assessment for capturing word-finding difficulties outside clinical settings, finding approximately 80% compliance but only 68.4% audio intelligibility — highlighting the challenge of building technology that accommodates the very communication impairments it is trying to measure.

## AAC in the Global South

Austin et al. [2025] evaluated Look to Speak, a free Android eye-gaze AAC app, for people with severe communication disabilities in Ghana. Despite initial enthusiasm, the app largely failed to deliver communication benefits. The interaction design was counter-intuitive — users must look away from an item to select it. The app speaks only English, not Ghanaian languages. And the study revealed that high-tech AAC without an ecosystem — trained professionals, appropriate seating equipment, culturally relevant content, ongoing support — cannot succeed. Without basic positioning support, some participants could not stabilise their heads sufficiently to produce reliable gaze input.

## Accessible Videoconferencing for Mixed Hearing Groups

Anant et al. [2023] built Jod, a videoconferencing platform purpose-built for mixed hearing groups. Standard platforms present barriers: limited layout customisation forces DHH users to struggle to see interpreters and signers simultaneously, audio-centric designs highlight speaking participants rather than signing ones, and there are no built-in mechanisms for DHH participants to signal for attention. Testing with 34 participants (18 DHH, 10 hearing, 6 interpreters) revealed that DHH participants allocated the interpreter's video tile nearly twice the visual space (59.7%) compared to hearing participants (33.7%), and frequently minimised or removed hearing participants' tiles entirely.

Kushalnagar and Vogler [2020] documented, from nearly a decade of first-hand DHH experience with videoconferencing, that DHH users must simultaneously manage interpreter video, speaker video, captions, presentation materials, chat boxes, and hand-raising tools — cognitive demands far exceeding those of hearing participants.

## What the Research Reveals

Across AAC devices, sign language technology, speech recognition, captioning, and communication in aphasia, several findings recur.

**Communication is more than words.** The nonverbal dimension — backchanneling, turn-taking, attention signalling, gesture, facial expression — constitutes a substantial portion of conversation, yet 92.3% of high-tech AAC supports only verbal communication [Curtis et al., 2022]. Technologies that augment rather than replace users' existing communication strategies are consistently preferred [Curtis & Neate, 2023; Curtis et al., 2025].

**Abandonment rates reflect design failures, not user failures.** When 67% of AAC users abandon their devices because the vocabulary does not match their daily lives [Albar, 2020], or when an eye-gaze app fails in Ghana because it speaks only English and requires head stability that users cannot achieve without positioning support [Austin et al., 2025], the problem is not user adoption but technology-context mismatch.

**The burden of communication access is unevenly distributed.** Over 90% of captioning research positions DHH individuals as the sole agents of access [McDonnell & Findlater, 2024]. Hearing speakers are rarely asked to modify their behaviour, despite evidence that simple changes — medium enunciation, dynamic intonation — significantly improve DHH comprehension [Seita et al., 2021]. Technology that shifts this burden — notification systems prompting hearing speakers, distributed captioning, hands-free interpreting — addresses a structural inequity.

**Sign language communities have legitimate authority over sign language technology.** Among ML practitioners working on sign language processing, 74% incorrectly identified ASL as universal, and many had never collaborated with a Deaf signer [Kamikubo et al., 2025]. Ninety-three percent of Deaf participants expressed privacy concerns about contributing sign language video data [Bragg et al., 2020]. Datasets built without community consent are ethically compromised and linguistically weaker than those built with community participation [Kezar et al., 2023].

**Personalisation is not optional.** The DIY diary that "belonged to" its user rather than to a speech therapist [Curtis et al., 2025], the smartwatch AAC that augmented rather than replaced gestural communication [Curtis & Neate, 2023], the tangible device that revealed unexpected capabilities [Bircanin et al., 2020] — the most valued communication tools are those that adapt to the person rather than requiring the person to adapt to the tool.

---

*This article draws on 81 peer-reviewed papers reviewed at A11y Paradise (a11ybob.com). All research cited was published at ACM conferences and venues between 2007 and 2025.*
