---
title: 'AI Safety and Disability: What Accessibility Research Reveals About Hallucination, Bias, Privacy, and the Protocols That Do and Don''t Exist'
publishedAt: '2026-05-06'
tags: []
---

# AI Safety and Disability: What Accessibility Research Reveals About Hallucination, Bias, Privacy, and the Protocols That Do and Don't Exist

## Disabled people depend on AI systems they cannot verify, trust AI outputs that fabricate content, and share intimate data with platforms that offer no disability-specific protections — and researchers are documenting exactly how and where things go wrong

When a blind person asks an AI to describe an image and the AI confidently invents details that are not there, that is not an abstract fairness problem. It is a safety problem. When a career chatbot fabricates a university degree on a neurodivergent user's cover letter, that is not a hallucination curiosity. It is a harm. When an emotion-detection system deployed in a classroom misidentifies an autistic child's facial expressions as anger, that is not a bias statistic. It is surveillance with consequences.

AI safety in the context of disability is different from AI safety in general. Disabled people are disproportionately dependent on AI systems for information that non-disabled people can verify independently. They share more intimate data — images of their bodies, recordings of their speech, videos of their signing — with fewer protections. And when AI systems fail, the consequences fall on people who may have no alternative.

This article examines what accessibility researchers have found about AI safety across approximately 135 peer-reviewed papers. The work spans documented harms, hallucination and fabrication, trust calibration, privacy, bias and stereotyping, data governance, the absence of protective protocols, and emerging approaches to making AI systems safer for the people who need them most.

## 79 Documented Incidents of AI Harm to Disabled People

The most systematic accounting of AI harm to disabled people comes from Venkatasubramanian et al. [2025], who searched eight publicly available AI incident databases — including AIAAIC, AIID, OECD AI Incident Monitor, and the Database of AI Litigation — containing over 17,700 entries. They extracted 79 incidents where AI systems produced negative outcomes specifically for people with disabilities and organised them into nine categories.

**Denying vital resources** was the most common (37 incidents). Medicaid resource allocation algorithms were found arbitrary and non-transparent in Idaho, Oregon, and multiple other US states. HireVue's facial-analysis hiring tool screened out candidates with disabilities. Accessibility features were removed from technology platforms. **Producing inaccurate outputs** (21 incidents) included captioning errors that distorted meaning, incorrect image descriptions, and autonomous vehicle failures to detect people with atypical body presentations. **Surveillance and privacy violations** (14 incidents) documented automated emotion recognition targeting autistic students in classrooms and data harvesting from disability-specific platforms. Other categories included perpetuating stereotypes, biased decision-making, reducing autonomy, causing physical harm, emotional distress, and enabling exploitation.

The taxonomy demonstrates that AI harms to disabled people are not hypothetical edge cases. They are documented, recurring, and concentrated in the systems that control access to welfare, employment, healthcare, and public services.

## Hallucination and Fabrication: The Verification Gap

The AI safety problem that is most acute for disabled users is hallucination — AI systems producing confident, plausible outputs that are partially or entirely fabricated. For users who cannot independently verify the output through another sensory channel, fabrication is undetectable.

Chen et al. [2025] addressed this directly. Multimodal LLMs like GPT-4o, Gemini, and Claude produce fluent image descriptions that "can contain fabricated content, misinterpretations, and omissions that are extremely difficult for blind and low vision (BLV) users to detect without sight." The researchers developed a protocol: asking the same model to describe the same image multiple times and surfacing the variations to users. The results were striking — users' ability to identify unreliable claims increased by 4.9 times (mean 2.62 unreliable claims identified versus 0.53, p < 0.001). Perceived reliability decreased from 5.78/7 for single descriptions to 3.93/7 when variations were visible. Fourteen of 15 participants preferred seeing variations over single descriptions. The approach works because AI tends to be consistent about real content and inconsistent about fabricated content — giving users a signal where none previously existed.

Chang et al. [2025] evaluated ChatGPT's Advanced Voice with Video feature — marketed as a real-time visual assistant — with eight blind and visually impaired participants and found that it could not actually provide live descriptions of dynamic scenes. It processed individual frames rather than continuous video, missing spatial context and temporal changes. Users had to repeatedly ask "Do you see the umbrella now?" rather than receiving continuous scene narration. More concerning was sycophantic behaviour: when participants challenged a correct answer, the model sometimes reversed itself, agreeing with the incorrect challenge. The paper describes this as "eroding trust in accurate responses" — a safety failure where the system's desire to be agreeable overrides its accuracy.

Hall et al. [2025] analysed 348 real-world chat logs from a GPT-4-powered career chatbot deployed on a neuroinclusive employment platform with over 46,000 neurodivergent users. The chatbot fabricated a user's university degree, claimed proficiency in skills the user did not possess, and imposed neurotypically-coded language that contradicted users' authentic communication styles. The researchers found that some users internalised the AI's inauthentic portrayal, "believing the chatbot's inauthentic portrayal reflected their own inadequacy." When a tool designed to help neurodivergent job-seekers makes them feel worse about themselves through fabricated self-descriptions, the harm is not merely inaccurate — it is psychologically damaging.

A study of 19 blind participants using generative AI tools [reported in the database, 2024] found they viewed ChatGPT as "the king of knowledge" but developed sophisticated verification strategies: cross-referencing with search engines, asking follow-up questions to probe for inconsistencies, using multiple AI tools and comparing outputs. These strategies represent user-developed safety protocols — but they require time, skill, and awareness that fabrication is even possible.

## The Trust Problem

Findlater et al. [2020] identified the trust problem as foundational. When AI systems augment sensory abilities — describing images for blind users, identifying sounds for deaf users — the training data and internal models are "inherently inaccessible to their target users." A blind person cannot see what the image classifier sees. A deaf person cannot hear what the sound classifier hears. This creates a feedback loop: "users may place too much trust in AI sensing results precisely because they cannot independently verify accuracy."

The concept of an "assistive use" legal exception — analogous to service animal accommodations under the ADA — was proposed as a way to allow assistive sensing in contexts where recording is otherwise prohibited [Findlater et al., 2020]. But no such legal framework currently exists, leaving the tension between surveillance concerns and assistive needs unresolved.

Tanis and Lewis [2020] examined this through the lens of cognitive disability and the "dignity of risk" — the right to make self-directed choices about tradeoffs between risks and benefits. They found that many people with cognitive disabilities and their caregivers were responding to AI risks by withdrawing entirely: refusing online job applications, declining to share data, avoiding AI-enabled services. While understandable, this withdrawal strategy forecloses the benefits AI could provide. The paper argues that well-intentioned privacy protections like the GDPR may paradoxically restrict data uses that could benefit disabled users while failing to prevent the harms they experience.

## Privacy: Intimate Data, No Protections

Disabled people share uniquely intimate data with AI systems. Blind users send photos of their surroundings, which may contain prescription labels, financial documents, or pregnancy tests [Stangl et al., 2020]. Sign language users contribute video showing their faces, bodies, and environments [Bragg et al., 2020]. People with speech disorders provide recordings of their voices. Neurodivergent users share details of their mental health challenges with chatbots [Hall et al., 2025].

Crawford et al. [2024] systematically analysed the privacy policies of 18 assistive technologies and found that **none included protections specific to individuals with disabilities**. Protections for children appeared in 13 of 18 policies, but no equivalent safeguards existed for disabled users. Eight of 18 failed to distinguish between essential data collection (needed for the AT to function) and non-essential data — with some, like Dragon Voice, listing collection of sexual orientation and immigration status without explaining why. The authors note that people with disabilities face nearly double the lifetime risk of intimate partner violence, making data privacy protections especially critical.

Stangl et al. [2020] conducted the first study of what visual content blind people consider private when using camera-based assistive technologies. Financial account information was the most concerning (4.6/5), followed by medical information (4.2), naked body images (4.1), and pregnancy test results (3.8). Critically, privacy concerns shifted based on who provides the description — blind users were less concerned sharing with AI systems than with remote human assistants, but more concerned about data retention and secondary use.

Bragg et al. [2020] found that 93% of deaf participants reported concerns about contributing sign language video for ML training, with the most common concern being video misuse (61%). Willingness to contribute varied dramatically by recipient: 90% would contribute to a company, 89% to a university, but only 36% to the public. Visual filters that anonymised signers also degraded the facial expression features that sign languages depend on — a privacy-performance trade-off with no clean resolution [Lee et al., 2021].

Akter et al. [2020] found that sighted bystanders were consistently less comfortable being captured by visually impaired users' camera-based AT than the visually impaired users themselves were comfortable using the technology — creating a social tension where privacy concerns of bystanders may restrict the assistive technology that disabled users depend on.

Woodin and Theil [2021] documented this regulatory dimension: the EU AI Act bans real-time biometric surveillance, and GDPR implementation varies by country, but no regulations provide accommodations for disabled users of personal cameras who need face recognition to identify who is nearby. The technology that could enable deafblind independence is regulated as surveillance equipment.

Alharbi et al. [2025] tested whether blind users could detect errors in AI privacy-protection techniques (obfuscation applied to sensitive content in their photos) and found that the assessment descriptors offered — colour, dimensions, distance — were "vague, sighted-centric, and misaligned with how blind people actually identify objects." Participants preferred descriptors that named objects directly and described multiple objects in the surrounding environment for cross-referencing. The finding reveals that even AI safety mechanisms designed to protect blind users may be built on sighted assumptions.

## Bias and Stereotyping

Dewan et al. [2025] administered 1,648 age-bias prompts to ChatGPT and found systematic stereotyping across four categories. Technology proficiency stereotypes were most prevalent (175 responses), portraying older adults as "old-timers" who are "overwhelmed" by technology. Cognitive and physical decline stereotypes appeared in 104 responses, associating older adults with being forgetful and "struggling with simple tasks." The model was most biased in ambiguous scenarios where information was insufficient to determine an answer — it defaulted to stereotypes when it lacked evidence.

Kafle et al. [2020] documented that emotion detection systems misidentify anger when analysing faces of sign language users, because facial expressions serve grammatical functions in ASL — raised eyebrows mark questions, furrowed brows mark topics — that emotion classifiers trained on non-signing populations interpret as emotional states. The paper warned that "cost-saving decision-makers will deploy imperfect AI captioning to replace human interpreters and captionists prematurely," reducing service quality for DHH people while claiming technological progress.

Guo et al. [2020] identified that outlier detection algorithms — used in fraud detection, CAPTCHAs, crowd-work quality control, and hiring systems — systematically disadvantage disabled people by design. Anyone whose behaviour patterns fall outside statistical norms is flagged, and disability by its nature places many people outside those norms. This is not a bug but a structural feature of how outlier detection works.

Wang et al. [2025] analysed 38 autism tech startup websites and found that most "heavily drew from medical model language," constructing autism as a crisis requiring urgent technological intervention. Fear-based marketing evoked parental guilt about "missed developmental windows," while selectively adopting neurodiversity-affirming language in marketing without fundamentally changing the deficit-based approach. The $34.1 billion autism treatment industry shapes how autism is represented in technology — a form of harm through discourse rather than through system failure.

Zastudil et al. [2025] documented a subtler form of bias: AI-generated suggestions for AAC communication tools homogenised designs across different users, with 61.8% of suggestions used without modification. AAC devices are effective precisely because they are personalised to individual communication needs, interests, and relationships. When AI generates similar suggestions for everyone, it flattens the diversity that makes these tools work.

## The Absent Protocols

What is most notable across this body of research is what does not exist.

No widely adopted protocol exists for testing AI systems specifically with disabled users before deployment. Kafle et al. [2020] noted that Word Error Rate — the standard evaluation metric for speech recognition — correlates poorly with DHH users' comprehension, yet it remains the industry standard. Systems that score well on standard benchmarks may fail for the populations that most need them.

No regulatory framework specifically protects disabled users of AI-powered assistive technology. Crawford et al. [2024] found zero disability-specific privacy protections across 18 AT privacy policies. Woodin and Theil [2021] found no regulatory accommodations for disabled users of personal cameras in any European jurisdiction. Tanis and Lewis [2020] found that the GDPR's restrictions may paradoxically harm people with cognitive disabilities by preventing beneficial data use while failing to prevent harmful data use.

No standard exists for communicating AI uncertainty to users who cannot independently verify outputs. Chen et al. [2025] developed a surfacing-variations approach that increased unreliable claim detection by 4.9 times, but this is a research prototype, not a deployed feature. Chang et al. [2025] found sycophantic behaviour in a major commercial AI assistant, with no mechanism to warn users that the system was agreeing with incorrect challenges.

No requirement exists for informed consent processes to be accessible to disabled participants. Seita et al. [2025] built a bilingual ASL-English consent form and found that 93.75% of researchers said it would make them more comfortable including DHH participants — implying that the absence of accessible consent forms is itself a barrier to inclusive AI safety research. Only 12.5-42.9% of researchers had ever included DHH sign language users in their studies.

## Emerging Approaches

The research does document emerging approaches to AI safety for disabled users, though none have achieved widespread adoption.

**Surfacing uncertainty.** Chen et al. [2025] demonstrated that showing multiple AI descriptions of the same image — making the AI's inconsistency visible — is a powerful trust calibration tool. The principle: when AI cannot be made reliable, make its unreliability detectable.

**Community-controlled data governance.** Kamikubo et al. [2025] proposed a collaboration framework for sign language AI where Deaf communities maintain control over data collection, use, and dissemination, with linguist-mediated translation between ML and Deaf epistemologies. Kezar et al. [2023] built the Sem-Lex Benchmark with full informed consent from 41 deaf signers, demonstrating that ethical data collection and high-quality ML training data are not in tension.

**Disability-specific evaluation metrics.** Kafle et al. [2020] developed an alternative to Word Error Rate that better predicted DHH user comprehension. The principle: AI systems intended for disabled users must be evaluated by disabled users using metrics that capture what matters to them, not by proxy metrics developed for other populations.

**Replacing empathy simulation with enculturation.** Baltaxe-Admony et al. [2024] introduced DREEM, a method that replaces disability simulation exercises — where non-disabled designers wear blindfolds or use wheelchairs — with an enculturation approach grounded in disability culture. Students who used DREEM moved away from "design saviorism" toward recognising disabled people as experts. The paper argues that simulation exercises, sometimes used in AI system design, are "deeply problematic because they reduce disability to a temporary inconvenience" and reinforce deficit-based thinking that leads to harmful AI design.

**Accessible research participation.** Seita et al. [2025] built bilingual consent forms. Boll et al. [2023] designed ASL-native survey tools. Unger et al. [2021] documented that all research materials must be available in sign language, not just written text. These are not AI safety protocols per se, but they address a prerequisite: if disabled people cannot participate in AI research, AI systems will be built without their input and tested without their evaluation.

**Human-AI collaboration as a safety architecture.** Multiple systems document a pattern where AI provides speed and scale while humans provide quality and accountability. CARTGPT augments human captioners [Wu et al., 2025]. DescribePro pairs AI with human audio describers [Cheema et al., 2025]. The principle: AI systems that affect disabled users' access to information should include human verification in the loop, particularly for high-stakes outputs.

## What Is Missing

The research identifies several critical gaps in AI safety for disabled users.

**No incident reporting system exists for disability-specific AI harms.** Venkatasubramanian et al. [2025] had to search across eight general AI incident databases and manually extract disability-relevant cases. A dedicated reporting mechanism would make harms visible and trackable.

**No pre-deployment testing requirement addresses disability.** AI systems that serve disabled users — image description services, speech recognition, career chatbots, hiring tools, benefits allocation — are deployed without mandatory evaluation by the populations they affect. The research consistently shows that standard benchmarks fail to predict real-world performance for disabled users [Kafle et al., 2020; Kacorri et al., 2017].

**No regulatory framework bridges assistive technology and AI regulation.** Privacy law treats camera-based AT as surveillance equipment. AI regulation does not recognise the distinctive dependency that disabled users have on AI-mediated information. Assistive technology policy does not address the AI systems increasingly embedded in AT devices. Disabled users fall through the gaps between regulatory domains [Woodin & Theil, 2021; Crawford et al., 2024].

**No standard for communicating AI limitations to users who cannot independently verify outputs.** Chen et al. [2025] showed that surfacing variations works. But this approach is not required, not standardised, and not widely implemented. The default in commercial AI products is to present a single confident output with no indication of uncertainty — the exact pattern the research shows is most dangerous for disabled users.

**No framework addresses the psychological safety of AI interaction for vulnerable users.** Hall et al. [2025] found that neurodivergent users internalised AI chatbot fabrications, believing the AI's misrepresentation reflected their own inadequacy. Chang et al. [2025] documented sycophantic behaviour that eroded trust in correct information. Dewan et al. [2025] showed systematic age stereotyping. The emotional and psychological effects of AI interaction on disabled users — not just the informational accuracy — remain largely unaddressed in safety frameworks.

## What the Research Points Toward

The accessibility research on AI safety does not propose a single solution. But it consistently points toward several principles.

**Disabled users' dependency on AI creates a higher safety obligation.** A hallucinated detail in an image description or a fabricated qualification on a cover letter causes specific, documentable harm to a person who has no alternative source of that information [Chen et al., 2025; Hall et al., 2025]. The standard of care for AI systems serving disabled users should be higher, not the same, as for general-population systems.

**Surfacing uncertainty is a safety mechanism.** When reliability cannot be guaranteed, making unreliability visible gives users the information they need to exercise judgment [Chen et al., 2025]. This principle is actionable now and does not require solving the underlying hallucination problem.

**Community authority over data and evaluation is both ethical and technically productive.** Datasets built with informed consent and linguistic expertise produce better ML models [Kezar et al., 2023]. Evaluation metrics developed with disabled users predict real-world performance better than standard metrics [Kafle et al., 2020]. Safety is not in tension with community involvement — it depends on it.

**Privacy protections must be specific to disability contexts.** Zero of 18 AT privacy policies include disability-specific protections [Crawford et al., 2024]. When the most intimate data — images of bodies, recordings of atypical speech, videos of signing — flows through systems with only generic legal boilerplate, the gap between vulnerability and protection is a safety failure.

**The burden of AI safety should not fall on disabled users.** Blind users developing their own verification strategies [2024], deaf communities self-governing their data [Kamikubo et al., 2025], neurodivergent users learning to distrust AI career advice [Hall et al., 2025] — the current state of AI safety for disabled users is one where users protect themselves from the systems designed to help them. This is not a sustainable model.

---

*This article draws on approximately 135 peer-reviewed papers reviewed at A11y Paradise (a11ybob.com). All research cited was published at ACM conferences and venues between 2020 and 2025.*
